import {isBrowser} from './is-browser';

export function getEnv() {
  return isBrowser() ? window.ENV : process.env;
}
