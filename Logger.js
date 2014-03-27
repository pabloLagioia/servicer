/*
 * custom-levels.js: Custom logger and color levels in winston
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */

var winston = require('winston');

/**
 * Logging levels
 * NOTE: log is not a valid level cause it causes an exception within winston
 */
var config = {
  levels: {
    info: 0,
    data: 1,
    warn: 2,
    debug: 3,
    error: 4
  },
  colors: {
    info: 'green',
    data: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
  }
};

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true
    })
  ],
  levels: config.levels,
  colors: config.colors
});

module.exports = logger;