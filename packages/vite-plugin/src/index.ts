/**
 * @sylphx/silk-vite-plugin
 * Zero-codegen Vite plugin using virtual CSS modules
 *
 * Architecture:
 * 1. Scan source files for css() calls
 * 2. Generate CSS via scanAndGenerate()
 * 3. Create virtual 'silk.css' module
 * 4. CSS flows through Vite's CSS pipeline (PostCSS, optimization, bundling)
 */

import type { Plugin } from 'vite';
import { scanAndGenerate, type GenerateOptions } from '@sylphx/silk/codegen';

export interface SilkVitePluginOptions extends GenerateOptions {
  /**
   * Source directory to scan for css() calls
   * @default './src'
   */
  srcDir?: string;

  /**
   * Virtual module ID (what users import)
   * @default 'silk.css'
   */
  virtualModuleId?: string;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

const VIRTUAL_MODULE_PREFIX = '\0virtual:';

/**
 * Silk Vite plugin - Zero-codegen with virtual CSS module
 *
 * @example
 * ```typescript
 * // vite.config.ts
 * import silk from '@sylphx/silk-vite-plugin'
 *
 * export default {
 *   plugins: [silk()]
 * }
 * ```
 *
 * ```typescript
 * // app.tsx
 * import 'silk.css'  // Virtual module → Vite CSS pipeline
 * ```
 */
export default function silkPlugin(options: SilkVitePluginOptions = {}): Plugin {
  const {
    srcDir = './src',
    virtualModuleId = 'silk.css',
    debug = false,
    ...generateOptions
  } = options;

  const resolvedVirtualModuleId = VIRTUAL_MODULE_PREFIX + virtualModuleId;

  let generatedCSS: string | null = null;
  let isDevMode = true;

  return {
    name: 'vite-plugin-silk',
    enforce: 'pre',

    configResolved(config) {
      isDevMode = config.command === 'serve';

      if (debug) {
        console.log(`[Silk] Mode: ${isDevMode ? 'development' : 'production'}`);
        console.log(`[Silk] Scanning: ${srcDir}`);
      }
    },

    async buildStart() {
      // Generate CSS on build start
      try {
        if (debug) {
          console.log('[Silk] Generating CSS...');
        }

        generatedCSS = await scanAndGenerate(srcDir, {
          ...generateOptions,
          minify: generateOptions.minify ?? !isDevMode,
          debug
        });

        if (debug) {
          console.log(`[Silk] Generated ${generatedCSS.length} bytes of CSS`);
        }
      } catch (error) {
        console.error('[Silk] CSS generation failed:', error);
        generatedCSS = '/* Silk CSS generation failed */';
      }
    },

    resolveId(id) {
      // Resolve virtual module
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
      return null;
    },

    load(id) {
      // Load virtual module
      if (id === resolvedVirtualModuleId) {
        if (!generatedCSS) {
          return '/* No CSS generated */';
        }

        return generatedCSS;
      }
      return null;
    },

    async handleHotUpdate({ file, server }) {
      // Watch mode: regenerate CSS on file changes
      if (!isDevMode) return;

      // Check if changed file is in srcDir and matches our patterns
      if (file.includes(srcDir) && /\.[jt]sx?$/.test(file)) {
        if (debug) {
          console.log(`[Silk] File changed: ${file}, regenerating CSS...`);
        }

        try {
          generatedCSS = await scanAndGenerate(srcDir, {
            ...generateOptions,
            minify: false,
            debug
          });

          // Trigger HMR for the virtual module
          const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
          if (module) {
            server.moduleGraph.invalidateModule(module);
            return [module];
          }
        } catch (error) {
          console.error('[Silk] CSS regeneration failed:', error);
        }
      }
    }
  };
}

// Named exports for clarity
export { silkPlugin };
