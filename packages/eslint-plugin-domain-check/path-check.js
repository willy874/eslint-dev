const path = require('path');

/**
 * @typedef {Object} PthCheckOptions
 * @property {string[]} allowPaths
 * @property {string[]} modulePaths
 */

/**
 * 
 * @param {Partial<PthCheckOptions>} options 
 * @returns {PthCheckOptions}
 */
function resolveOptions(options = {}) {
  const { allowPaths = [], modulePaths = [] } = options
  return {
    allowPaths,
    modulePaths,
  }
}

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: "Enforce that a variable named `foo` can only be assigned a value of 'bar'.",
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          allowPaths: {
            type: 'array',
            uniqueItems: true,
            items: {
              type: 'string',
            },
          },
          modulePaths: {
            type: 'array',
            uniqueItems: true,
            items: {
              type: 'string',
            },
          },
        },
      }
    ],
  },
  create(context) {
    /** @type {import('eslint').Rule.RuleContext} */
    const ctx = context;
    const options = resolveOptions(context.options[0])
    const allowPaths = options.allowPaths.map((p) => path.resolve(ctx.cwd, p))
    const modulePaths = options.modulePaths.map((p) => path.resolve(ctx.cwd, p))
    /** @type {import('eslint').Rule.RuleListener} */
    return {
      Program(n) {
        const body = n.body;
        if (!body) {
          return;
        }
        body.forEach((node) => {
          if (node.type === 'ImportDeclaration') {
            /** @type {string} */
            const importPath = path.resolve(path.dirname(ctx.filename), node.source.value);
            const dirPath = path.dirname(ctx.filename);
            if (allowPaths.map((p) => importPath.startsWith(p)).length) {
              return
            }
            const modulesPath = modulePaths.find((p) => importPath.startsWith(p));
            if (modulesPath) {
              const moduleName = dirPath.replace(modulesPath, '').match(/[^/]+/)[0];
              const targetModuleName = importPath.replace(modulesPath, '').match(/[^/]+/)[0];
              if (moduleName === targetModuleName) {
                return
              }
            }
            if (ctx.filename.startsWith(importPath)) {
              return
            }
            ctx.report({
              node: node.source,
              message: `Import path ${importPath} is not in the scope of the module.`,
            })
          }
        });
      },
    };
  },
};
