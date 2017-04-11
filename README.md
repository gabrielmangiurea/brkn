# brkn [![Build Status](https://travis-ci.org/GabrielMangiurea/brkn.svg?branch=master)](https://travis-ci.org/GabrielMangiurea/brkn)

Yet another broken link checker CLI.

## Install
```
$ npm install --global brkn
```

## Usage
```
$ brkn <url> --attr [html attributes (default: href src)] [--verbose]
```

## Options
```
-a, --attr     The attributes to search for (space separated if more than one) (default: href, src)
-v, --verbose  Run in verbose mode
--help         Show this screen
--version      Show version number
```

## Examples
```
$ brkn https://github.com
$ brkn https://nodejs.org --attr src
$ brkn https://npmjs.com --attr href src --verbose
```

## License
MIT &copy; [Gabriel Mangiurea](https://gabrielmangiurea.github.io)
