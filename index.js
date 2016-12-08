const Dgeni = require('dgeni'),
    copy = require('copy');

function DocsGeneratorPlugin (options) {
    this.options = Object.assign({
        enable       : true,
        staticContent: './docs',
        sources      : [
            {
                include : 'src/app/**/**/*.js',
                basePath: 'src/app'
            }
        ],
        output       : 'dist-docs'
    }, options);

    if (!Array.isArray(this.options.sources)) {
        this.options.sources = [].concat(this.options.sources);
    }

    this.options.sources.push({
        include   : `${this.options.staticContent}/**/*.ngdoc`,
        basePath  : this.options.staticContent,
        fileReader: 'ngdocFileReader'
    });

    this.dgeni = new Dgeni([require('./config')(this.options.output, this.options.sources)])
}

DocsGeneratorPlugin.prototype.apply = function (compiler) {
    let options = this.options;
    let dgeni = this.dgeni;

    compiler.plugin("compile", function () {
        if (options.enable) {
            dgeni.generate();
            copy(__dirname + '/app/**/*.{js,html,css}', options.output, (err) => {
                if (err) throw err;
            });
        }
    });


    compiler.plugin("emit", (compilation, callback) => {
        callback();
    });
};

module.exports = DocsGeneratorPlugin;
