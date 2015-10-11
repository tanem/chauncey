# chauncey

[![NPM version](https://badge.fury.io/js/chauncey.svg)](http://badge.fury.io/js/chauncey)
[![Dependency status](https://david-dm.org/tanem/chauncey.svg)](https://david-dm.org/tanem/chauncey)

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

Chauncey will output the shortened URL to `stdout`. Assuming we have a correctly configured `.chaunceyrc` file:

```
$ chauncey http://google.com/
http://bit.ly/1jib0Hi
```

## Note

This module uses the Bitly API, but is neither developed nor endorsed by Bitly.

## License

MIT