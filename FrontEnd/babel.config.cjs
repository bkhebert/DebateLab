// Used only by Jest to transpile TS/JSX for unit/component tests.
// Vite (dev/build) doesn't use this at all - it has its own esbuild pipeline.
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
};
