# brkn
Yet another broken link checker CLI.

[![Build Status](https://travis-ci.org/GabrielMangiurea/brkn.svg?branch=master)](https://travis-ci.org/GabrielMangiurea/brkn)

## Install
```
$ npm install --global brkn
```

## Usage
```
$ brkn <url> --attr <html attributes> [--verbose]
```

## Options
```
-a, --attr     The attributes to search for (space separated if more than one)
-v, --verbose  Run in verbose mode
--help         Show this screen
--version      Show version number
```

## Examples
```
$ brkn https://nodejs.org --attr src
$ brkn https://npmjs.com --attr href src --verbose
```

## License
MIT &copy; [Gabriel Mangiurea](https://gabrielmangiurea.github.io)
