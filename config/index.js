// Canonical path provides a consistent path (i.e. always forward slashes) across different OSes
var path = require('canonical-path');

var Package = require('dgeni').Package;
var packagePath = __dirname;

// Create and export a new Dgeni package
// We will use Gulp later on to generate that package
// Think of packages as containers, our 'myDoc' package contains other packages
// which themselves include processors, services, templates...
module.exports = function (destPath, sources) {
  return new Package('cma-docs', [
    require('dgeni-packages/ngdoc'),
    require('dgeni-packages/nunjucks')
  ])

    .processor(require('./processors/navigation'))


    .config(function (log, readFilesProcessor, templateFinder, writeFilesProcessor) {

      // Set the log level to 'info', switch to 'debug' when troubleshooting
      log.level = 'info';

      // Specify the base path used when resolving relative paths to source and output files
      readFilesProcessor.basePath = path.resolve(packagePath, '../../..');

      // Specify our source files that we want to extract
      readFilesProcessor.sourceFiles = sources;

      // Use the writeFilesProcessor to specify the output folder for the extracted files
      writeFilesProcessor.outputFolder = destPath;

    })

    .config(function (templateFinder) {
      // Specify where the templates are located
      templateFinder.templateFolders.unshift(path.resolve(packagePath, 'templates'));
    })

    .config(function (computePathsProcessor, computeIdsProcessor) {

      computeIdsProcessor.idTemplates.push({
        docTypes  : ['content', 'indexPage'],
        getId     : function (doc) {
          return doc.fileInfo.baseName;
        },
        getAliases: function (doc) {
          return [doc.id];
        }
      });


      // Build custom paths and outputPaths for "content" pages (theming and CSS).
      computePathsProcessor.pathTemplates.push({
        docTypes          : ['content'],
        getPath           : function (doc) {
          var docPath = path.dirname(doc.fileInfo.relativePath);
          if (doc.fileInfo.baseName !== 'index') {
            docPath = path.join(docPath, doc.fileInfo.baseName);
          }
          return docPath;
        },
        outputPathTemplate: 'partials/${path}.html'
      });


      // Here we are defining our docType Module
      //
      // Each angular module will be extracted to it's own partial
      // and will act as a container for the various Components, Controllers, Services in that Module
      // We are basically specifying where we want the output files to be located
      computePathsProcessor.pathTemplates.push({
        docTypes          : ['module'],
        pathTemplate      : '${area}/${name}',
        outputPathTemplate: 'partials/${area}/${name}.html'
      });

      // Doing the same thing but for regular types like Services, Controllers, etc...
      // By default they are grouped in a componentGroup and processed via the generateComponentGroupsProcessor internally in Dgeni
      computePathsProcessor.pathTemplates.push({
        docTypes          : ['componentGroup'],
        pathTemplate      : '${area}/${moduleName}/${groupType}',
        outputPathTemplate: 'partials/${area}/${moduleName}/${groupType}.html'
      });

      computePathsProcessor.pathTemplates.push({
        docTypes          : ['overview'],
        getPath           : function (doc) {
          var docPath = path.dirname(doc.fileInfo.relativePath);
          if (doc.fileInfo.baseName !== 'index') {
            docPath = path.join(docPath, doc.fileInfo.baseName);
          } else {
            return 'index';
          }
          return docPath;
        },
        outputPathTemplate: 'partials/${path}.html'
      });

      computeIdsProcessor.idTemplates.push({
        docTypes  : ['overview'],
        getId     : function (doc) {
          return doc.fileInfo.baseName;
        },
        getAliases: function (doc) {
          return [doc.id];
        }
      });

    });
}
