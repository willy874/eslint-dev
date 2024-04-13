/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce that a variable named `foo` can only be assigned a value of 'bar'.",
    },
    fixable: "code",
    schema: [],
  },
  create(context) {
    /** @type {import('eslint').Rule.RuleContext} */
    const ctx = context
    /** @type {import('eslint').Rule.RuleListener} */
    return {
      'CallExpression[callee.name="test"]'(node) {
        console.log(node);
      },
      VariableDeclarator(node) {
        if (node.parent.kind === "const") {
          if (node.id.type === "Identifier" && node.id.name === "foo") {
            if (
              node.init &&
              node.init.type === "Literal" &&
              node.init.value !== "bar"
            ) {
              ctx.report({
                node,
                message:
                  'Value other than "bar" assigned to `const foo`. Unexpected value: {{ notBar }}.',
                data: {
                  notBar: node.init.value,
                },
                fix(fixer) {
                  return fixer.replaceText(node.init, '"bar"');
                },
              });
            }
          }
        }
      },
    };
  },
};
