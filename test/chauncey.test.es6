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

test('token passed directly', (t) => {
  const response = new PassThrough();
  response.end(new Buffer(shortenedUrl));
  const getStub = sinon.stub(https, 'get').yields(response).returns(new EventEmitter());

  chauncey({
    url: originalUrl,
    token: '123abc',
    done: (error, result) => {
      t.equal(
        getStub.firstCall.args[0],
        'https://api-ssl.bitly.com/v3/shorten?access_token=123abc&longUrl=http://original/&format=txt'
      );
      t.equal(error, null);
      t.equal(result, shortenedUrl);
      t.end();
      getStub.restore();
    }
  });
});

test('token set in environment', (t) => {
  const response = new PassThrough();
  response.end(new Buffer(shortenedUrl));
  const getStub = sinon.stub(https, 'get').yields(response).returns(new EventEmitter());
  process.env.BITLY_ACCESS_TOKEN = '123abc';

  chauncey({
    url: originalUrl,
    done: (error, result) => {
      t.equal(
        getStub.firstCall.args[0],
        'https://api-ssl.bitly.com/v3/shorten?access_token=123abc&longUrl=http://original/&format=txt'
      );
      t.equal(error, null);
      t.equal(result, shortenedUrl);
      t.end();
      delete process.env.BITLY_ACCESS_TOKEN;
      getStub.restore();
    }
  });
});

test('token set in .chaunceyrc', (t) => {
  const response = new PassThrough();
  response.end(new Buffer(shortenedUrl));
  const getStub = sinon.stub(https, 'get').yields(response).returns(new EventEmitter());
  const chaunceyrcPath = path.join(process.cwd(), '.chaunceyrc');
  fs.writeFileSync(chaunceyrcPath, 'export BITLY_ACCESS_TOKEN=123abc');

  chauncey({
    url: originalUrl,
    done: (error, result) => {
      t.equal(
        getStub.firstCall.args[0],
        'https://api-ssl.bitly.com/v3/shorten?access_token=123abc&longUrl=http://original/&format=txt'
      );
      t.equal(error, null);
      t.equal(result, shortenedUrl);
      t.end();
      delete process.env.BITLY_ACCESS_TOKEN;
      fs.unlinkSync(chaunceyrcPath);
      getStub.restore();
    }
  });
});

test('error if token not found', (t) => {
  const chaunceyrcPath = path.join(process.cwd(), '.chaunceyrc');
  fs.writeFileSync(chaunceyrcPath, '');

  chauncey({
    url: originalUrl,
    done: (error, result) => {
      t.equal(error.message, 'BITLY_ACCESS_TOKEN not found');
      t.equal(result, undefined);
      t.end();
      fs.unlinkSync(chaunceyrcPath);
    }
  });
});

test('error if issue with request', (t) => {
  const emitter = new EventEmitter();
  const getStub = sinon.stub(https, 'get').returns(emitter);

  chauncey({
    url: originalUrl,
    token: '123abc',
    done: (error, result) => {
      t.equal(error.message, 'boom');
      t.equal(result, undefined);
      t.end();
      getStub.reset();
    }
  });

  process.nextTick(() => emitter.emit('error', new Error('boom')));

});
