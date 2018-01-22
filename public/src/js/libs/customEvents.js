var EventEmitter = require('events').EventEmitter;
var customEvent = new EventEmitter();

export {customEvent};


//string
export const SHOW_ADD_PROJECT = 'SHOW_ADD_PROJECT';
export const SHOW_ADD_RESOURCE = 'SHOW_ADD_RESOURCE';
export const SHOW_SNACK = 'SHOW_SNACK';
export const REFRESH_PROJECT_LIST = 'REFRESH_PROJECT_LIST';