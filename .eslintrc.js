//  eslint public/src/js
//  eslint routes

module.exports = {
    env: {
        browser: true,
        node: true,
        commonjs: true,
        amd: true,
        es6: true,
        jquery: true,
        mocha: true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
    ],
    globals: {
        $: "readonly",
        jQuery: "readonly",
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
        ace: "readonly",
        html2canvas: "readonly",
        echarts: "readonly",
    },
    parser: "babel-eslint",
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        sourceType: "module",
        // allowImportExportEverywhere: true
    },
    plugins: ["react"],
    settings: {
        react: {
            pragma: "React",
            version: "detect",
        }
    },
    rules: {
        'no-unused-vars': [2,
            {
                'vars': 'all', // 变量定义必须被使用
                'args': 'none', // 对于函数形参不检测
                'ignoreRestSiblings': true, // 忽略剩余子项 fn(...args)，{a, b, ...coords}
                'caughtErrors': 'none', // 忽略 catch 语句的参数使用
            }
        ],
        "no-console": "warn",
        "react/prop-types": 0,
    }
};