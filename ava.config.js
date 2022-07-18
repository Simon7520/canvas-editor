module.exports = {
  require: ['ts-node/register'],
  files: ['test/ava/*.{test,spec}.{js,ts}'],
  // extensions: ['js', 'ts'],
  typescript: {
    'rewritePaths': {
    },
    'compile': false
  }
}
