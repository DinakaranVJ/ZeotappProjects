// astHelpers.js

function createAST(ruleString) {
    // A simple parser that creates a mock AST from the rule string
    // In practice, you'd want to replace this with a proper parsing mechanism
    return {
        type: "root",
        value: ruleString,
        left: null,
        right: null
    };
}

function evaluateAST(ast, jsonData) {
    // Placeholder evaluation logic. This should match the AST structure.
    // Modify this according to your AST parsing and logic.
    const evalResult = eval(ast.value); // WARNING: Using eval() can be dangerous! Use a safer approach.
    return evalResult;
}

module.exports = {
    createAST,
    evaluateAST
};
