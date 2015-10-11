'use strict';

var https = require('https');
var concat = require('concat-stream');
var findNearest = require('find-nearest-file');
var habitat = require('habitat');

module.exports = function (options) {
  
  var url = options.url;
  var done = options.done || function () {};

  try {
    var token = options.token || findToken();
  } catch (error) {
    return done(error);
  }

  https.get('https://api-ssl.bitly.com/v3/shorten?access_token=' + token + '&longUrl=' + url + '&format=txt', function (res) {
    res.pipe(concat({ encoding: 'string' }, function (res) {
      done(null, res);
    }));
  }).on('error', done);

};

function findToken() {
  habitat.load(findNearest('.chaunceyrc'));
  var token = habitat.get('BITLY_ACCESS_TOKEN');
  if (!token) throw new Error('BITLY_ACCESS_TOKEN not found');
  return token;
}
