module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "no-unused-vars": [2, { 
      // 允许声明未使用变量
      "vars": "local",
      // 参数不检查
      "args": "none" 
    }],
    // 关闭语句强制分号结尾
    "semi": [0],
    //空行最多不能超过100行
    "no-multiple-empty-lines": [0, {"max": 100}],
    //关闭禁止混用tab和空格
    "no-mixed-spaces-and-tabs": [0],
    "indent": 0,
    "no-unused-vars": 0,
    "quotes": [1, "single"], //使用单引号，提示是警告
    "quotes": [0, "double"], //使用双引号，关闭
    "space-before-function-paren": 0,
    "object-curly-spacing": 0,
    "keyword-spacing": 0,
    "no-trailing-spaces": 0,
    "key-spacing": 0,
    "comma-spacing": 0,
    "spaced-comment": 0,
    "eol-last": 0,
    "standard/object-curly-even-spacing": 0,
    "vue/no-unused-vars": 0,
    "no-useless-return": 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
