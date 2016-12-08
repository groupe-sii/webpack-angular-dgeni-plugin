# webpack-angular-dgeni-plugin

> Webpack plugin for generate dgeni angular documentation with default template

Angular documentation is generated with [DGeni](https://github.com/angular/dgeni)

Please refer to [Angular documentation](https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation) for doc's comments generation.

## Configuration

Webpack plugin definition :
```js
new DocsGeneratorPlugin({
    enable       : true,
    staticContent: './docs',
    sources      : {
      include : 'src/app/**/**/*.js',
      basePath: 'src/app'
    },
    output       : 'dist-docs'
})
```
- `enable` allow you to disable docs generation with variable
- `staticContent` contain ngdoc static file (markdown type). You can find example under `static-example`
- `sources` describe all folder to be scan
    - `include` source glob pattern
    - `basePath` root path for source pattern
- `output` output directory

## ChangeLog

###Unreleased

####Added

- Add Webpack plugin structure
- Add Dgeni processor
- Add Dgeni templates 

## License

MIT License

Copyright (c) 2016 Groupe SII