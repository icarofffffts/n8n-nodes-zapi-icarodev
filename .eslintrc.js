module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'n8n-nodes-base'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:n8n-nodes-base/nodes',
        'plugin:n8n-nodes-base/credentials',
    ],
    env: {
        node: true,
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'n8n-nodes-base/node-param-description-missing-final-period': 'off',
        'n8n-nodes-base/node-param-description-wrong-for-dynamic-options': 'off',
    },
};
