/**
 * Polyfill stable language features. These imports will be optimized by `@babel/preset-env`.
 *
 * See: https://github.com/zloirock/core-js#babel
 */
import 'core-js/stable';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'regenerator-runtime/runtime';
