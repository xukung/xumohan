var EventEmitter = require('events').EventEmitter;
var customEvent = new EventEmitter();

export {customEvent};


//string
export const REFRESH_ARTICLE_LIST = 'REFRESH_ARTICLE_LIST';