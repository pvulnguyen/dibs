/** @type {import('@remix-run/dev').AppConfig} */
export default {
  appDirectory: 'src/app',
  cacheDirectory: 'node_modules/.cache/remix',
  ignoredRouteFiles: ['**/.*'],
  serverDependenciesToBundle: ['remix-i18next'],
  serverModuleFormat: 'esm',
  serverPlatform: 'node',
};
