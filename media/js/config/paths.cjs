/* global process */

'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

const JS_PATH = 'media/js/';

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
    const hasSlash = path.endsWith('/');
    if (hasSlash && !needsSlash) {
        return path.substr(path, path.length - 1);
    } else if (!hasSlash && needsSlash) {
        return `${path}/`;
    } else {
        return path;
    }
}

const getPublicUrl = (appPackageJson) => {
    return envPublicUrl || require(appPackageJson).homepage;
};

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
    const publicUrl = getPublicUrl(appPackageJson);
    const servedUrl =
          envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
    return ensureSlash(servedUrl, true);
}

// config after eject: we're in ./config/
module.exports = {
    dotenv: resolveApp('.env'),
    appBuild: resolveApp(JS_PATH + 'build'),
    appPublic: resolveApp(JS_PATH + 'public'),
    appEditorJs: resolveApp(JS_PATH + 'src/editor-main.jsx'),
    appViewerJs: resolveApp(JS_PATH + 'src/viewer-main.jsx'),
    appStepGraphViewerJs: resolveApp(JS_PATH + 'src/stepGraphViewer-main.jsx'),
    appRubricJs: resolveApp(JS_PATH + 'src/rubric-main.jsx'),
    appGraphPreviewJs: resolveApp(JS_PATH + 'src/graphPreview-main.jsx'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp(JS_PATH + 'src'),
    yarnLockFile: resolveApp('yarn.lock'),
    testsSetup: resolveApp(JS_PATH + 'src/setupTests.js'),
    appNodeModules: resolveApp('node_modules'),
    publicUrl: getPublicUrl(resolveApp('package.json')),
    servedPath: getServedPath(resolveApp('package.json')),
};
