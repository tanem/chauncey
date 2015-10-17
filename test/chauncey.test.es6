import sinon from 'sinon';
import test from 'tape';
import https from 'https';
import { PassThrough } from 'stream';
import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';
import chauncey from '../src/lib/chauncey';

const originalUrl = 'http://original/';
const shortenedUrl = 'http://shortened/';

test('token passed directly', (assert) => {
  const response = new PassThrough();
  response.end(new Buffer(shortenedUrl));
  const getStub = sinon.stub(https, 'get')
    .yields(response)
    .returns(new EventEmitter());

  chauncey({
    url: originalUrl,
    token: '123abc',
    done: (error, result) => {
      assert.equal(
        getStub.firstCall.args[0],
        'https://api-ssl.bitly.com/v3/shorten?access_token=123abc&longUrl=http://original/&format=txt',
        'should use the correct API URL'
      );
      assert.equal(error, null, 'error should be null');
      assert.equal(
        result,
        shortenedUrl,
        'should output the correct shortened url'
      );
      assert.end();
      getStub.restore();
    }
  });
});

test('token set in environment', (assert) => {
  process.env.BITLY_ACCESS_TOKEN = '123abc';
  const response = new PassThrough();
  response.end(new Buffer(shortenedUrl));
  const getStub = sinon.stub(https, 'get')
    .yields(response)
    .returns(new EventEmitter());

  chauncey({
    url: originalUrl,
    done: (error, result) => {
      assert.equal(
        getStub.firstCall.args[0],
        'https://api-ssl.bitly.com/v3/shorten?access_token=123abc&longUrl=http://original/&format=txt',
        'should use the correct API URL'
      );
      assert.equal(error, null, 'error should be null');
      assert.equal(
        result,
        shortenedUrl,
        'should output the correct shortened url'
      );
      assert.end();
      delete process.env.BITLY_ACCESS_TOKEN;
      getStub.restore();
    }
  });
});

test('token set in .chaunceyrc', (assert) => {
  const chaunceyrcPath = path.join(process.cwd(), '.chaunceyrc');
  fs.writeFileSync(chaunceyrcPath, 'export BITLY_ACCESS_TOKEN=123abc');
  const response = new PassThrough();
  response.end(new Buffer(shortenedUrl));
  const getStub = sinon.stub(https, 'get')
    .yields(response)
    .returns(new EventEmitter());

  chauncey({
    url: originalUrl,
    done: (error, result) => {
      assert.equal(
        getStub.firstCall.args[0],
        'https://api-ssl.bitly.com/v3/shorten?access_token=123abc&longUrl=http://original/&format=txt',
        'should use the correct API URL'
      );
      assert.equal(error, null, 'error should be null');
      assert.equal(
        result,
        shortenedUrl,
        'should output the correct shortened url'
      );
      assert.end();
      delete process.env.BITLY_ACCESS_TOKEN;
      fs.unlinkSync(chaunceyrcPath);
      getStub.restore();
    }
  });
});

test('error if token not found', (assert) => {
  const chaunceyrcPath = path.join(process.cwd(), '.chaunceyrc');
  fs.writeFileSync(chaunceyrcPath, '');

  chauncey({
    url: originalUrl,
    done: (error, result) => {
      assert.equal(
        error.message,
        'BITLY_ACCESS_TOKEN not found',
        'error message should be correct'
      );
      assert.equal(result, undefined, 'result should be undefined');
      assert.end();
      fs.unlinkSync(chaunceyrcPath);
    }
  });
});

test('error if issue with request', (assert) => {
  const emitter = new EventEmitter();
  const getStub = sinon.stub(https, 'get').returns(emitter);

  chauncey({
    url: originalUrl,
    token: '123abc',
    done: (error, result) => {
      assert.equal(error.message, 'boom', 'error message should be correct');
      assert.equal(result, undefined, 'result should be undefined');
      assert.end();
      getStub.reset();
    }
  });

  process.nextTick(() => emitter.emit('error', new Error('boom')));

});
