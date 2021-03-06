module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['>0.2%', 'not dead', 'not op_mini all'],
        },
      },
    ],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime'],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          src: './src',
        },
      },
    ],
  ],
  // This is critical to not break any global scope set by
  // the original QC cmp2.js.
  exclude: ['**/qcCmpModified.js'],
}
