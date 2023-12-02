// Learn more https://docs.expo.dev/guides/monorepos
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// #1 - Watch all files in the monorepo
config.watchFolders = [workspaceRoot];
// #3 - We need to keep this enabled to allow dependencies to be found at root
config.resolver.disableHierarchicalLookup = false;
// #2 - Try resolving with project modules first, then workspace modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
// #4 - Enable symlinks
config.resolver.unstable_enableSymlinks = true;

const reactNativeLocation = require.resolve('react-native');

config.transformer.asyncRequireModulePath = require.resolve('metro-runtime/src/modules/asyncRequire', {
  paths: [reactNativeLocation]
})

config.resolver.useWatchman = false;

// Use turborepo to restore the cache when possible
config.cacheStores = [
  new FileStore({ root: path.join(projectRoot, 'node_modules', '.cache', 'metro') }),
];

module.exports = config;
