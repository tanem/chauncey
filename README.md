# chauncey

[![NPM version](https://badge.fury.io/js/chauncey.svg)](http://badge.fury.io/js/chauncey)
[![Build Status](https://travis-ci.org/tanem/chauncey.png?branch=master)](https://travis-ci.org/tanem/chauncey)
[![Dependency status](https://david-dm.org/tanem/chauncey.svg)](https://david-dm.org/tanem/chauncey)
[![devDependency Status](https://david-dm.org/tanem/chauncey/dev-status.svg)](https://david-dm.org/tanem/chauncey#info=devDependencies)

Shorten URLs with [Bitly](https://bitly.com/).

```
Usage: chauncey <url> [options]

Options:
  -h, --help  Show help

Example:
  chauncey http://google.com/  Shorten http://google.com/ using Bitly
```

## "Chauncey"?

Chauncey McPufferson is Bitly's mascot :smiley:

## Installation

```
$ npm i -g chauncey
```

## Configuration

First you need a [Bitly developer access token](http://dev.bitly.com/authentication.html). Then you'll need to add the token to your user environment, for example:

```
$ BITLY_ACCESS_TOKEN=[access token] chauncey http://google.com/
```

You can also use a `.chaunceyrc` file. Chauncey will look for `.chaunceyrc` starting in `process.cwd()`, then `../`, `../../`, all the way up to the filesystem root. It should have the following content:

```
export BITLY_ACCESS_TOKEN=[access token]
```

## Usage

Chauncey will output the shortened URL to `stdout`:

```
$ chauncey http://google.com/
http://bit.ly/1jib0Hi
```

So on OS X, you can do stuff like:

```
$ chauncey http://google.com/ | pbcopy
```

## API

### chauncey(url, [token], [done])

Applies `iterator` to each item in `arr`, concatenating the results. Returns the
concatenated list. The `iterator`s are called in parallel, and the results are
concatenated as they return. There is no guarantee that the results array will
be returned in the original order of `arr` passed to the `iterator` function.

__Arguments__

* `url` - The URL to shorten.
* `token` - *Optional* Bitly access token. Will take precedence over `BITLY_ACCESS_TOKEN` defined in the user environment. See [configuration](#configuration).
* `done(error, result)` - *Optional* A callback which is called with the shortened URL, or an error.

__Example__

```js
import chauncey from 'chauncey';

chauncey({
  url: 'http://google.com/',
  token: '123abc',
  done: (error, result) => {
    if (error) return console.error(error.message);
    console.log(result);
  }
});
```

## Tests

```
$ npm test
```

## Note

This module uses the Bitly API, but is neither developed nor endorsed by Bitly.

## License

MIT