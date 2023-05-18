module.exports = {
    extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    parserOptions: {
        // 想使用的额外的语言特性:
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            // 启用 JSX
            jsx: true,
        },
        sourceType: 'module',
        // ECMAScript版本
        ecmaVersion: 6,
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
        'import/no-anonymous-default-export': 0,
        '@typescript-eslint/no-var-requires': 0,
    },
};
