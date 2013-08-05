/*!
 * grunt-bower-distribute
 * https://github.com/psyrendust/grunt-bower-distribution
 *
 * Copyright (c) 2013 Larry Gordon
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var getDataType = function (obj) {
    return Object.prototype.toString.call(obj).replace(/\[(object )(.+?)\]/gim, '$2');
  };

  grunt.registerMultiTask('bowerdist', 'Your task description goes here.', function() {

    var done = this.async();
    var _ = require('lodash');
    var path = require('path');
    var bower = require('bower');
    var log = grunt.log.writeln;
    var vlog = grunt.verbose.writeln;
    var options = this.options({
      bowerpackage: 'bower.json',
      bowerrc: '.bowerrc',
      cleanTargetDir: true,
      cleanTargetDirForce: true,
      dest: 'dist/'
    });
    if (!grunt.file.exists(options.bowerpackage)) {
      grunt.log.warn('Source file "' + options.bowerpackage + '" not found.');
    }
    if (!grunt.file.exists(options.bowerrc)) {
      grunt.log.warn('Source file "' + options.bowerrc + '" not found.');
    }

    var isVerbose = _.contains(grunt.option.flags(), '--verbose');
    var bowerpackage = grunt.file.readJSON(options.bowerpackage);
    var bowerrc = grunt.file.readJSON(options.bowerrc);
    var bowerdir = bowerrc.directory || 'bower_components';
    var packages = _.keys(bowerpackage.dependencies);
    var list = [];
    var projectcwd = process.cwd();
    var cwd = path.join(projectcwd, bowerdir);
    var dest = path.resolve(projectcwd, options.dest);
    var report = [];
    bower.commands.list({paths: true}).on('end', function (data) {
      vlog('Generating list of installed Bower packages.'.green);
      var files = [];
      var folders = [];
      var srcpath = path.join(cwd, '/', bowerdir, '/');
      _.forEach(data, function (pkg, key) {
        if (!_.contains(bowerpackage.excludeDependencies, key)) {
          list.push(key);
          if (bowerpackage.exportsOverride[key]) {
            log('found! '.green + key);
          } else {
            log('nope! '.red + key);
          }
          _.forEach(pkg.split(','), function (file) {
            if (grunt.file.isDir(file)) {
              folders.push(file);
            } else {
              files.push(file);
            }
          });
        }
      });

      _.forEach(folders, function (folder) {
        var paths = grunt.file.expand({filter: 'isFile'}, path.join(folder, '/**'));
        // log('--------------------------------------'.red);
        // log(paths);
      });

      loadListComplete(_.map(files, function (file) {
        return file.replace(srcpath, '');
      }));
      if (isVerbose) {
        _.map(list, function (pkg) {
          var header = '\nLocated package "' + pkg.name + '"';
          vlog(header.underline.bold);
          _.map(pkg.files, function (file) {
            var type = (grunt.file.isDir(file)) ? 'Folder: '.magenta : 'File: '.cyan;
            report.push(pkg.name.magenta + ': ' + file);
            vlog(type + file);
          });
        });
      }
    });
    function loadListComplete (paths) {
      var fileMappings = grunt.file.expandMapping(paths, path.normalize(options.dest), {flatten: false, cwd:cwd});
      cleanTarget(function () {
        copyFiles(fileMappings);
      });
    }
    function cleanTarget(callback) {
      // if (options.cleanTargetDir) {
      //   log(('\nCleaning target "'+dest.yellow+'"').underline);
      //   _.map(list, function (pkg) {
      //     grunt.file.delete(path.join(dest, pkg.name), {force: options.cleanTargetDirForce});
      //   });
      //   grunt.log.write("Target cleaned...");
      //   grunt.log.ok();
      // }
      // callback();
    }
    function copyFiles (fileMappings) {
      // log(('\nCopying files to "'+dest.yellow+'"').underline);
      // _.map(fileMappings, function (map) {
      //   if (grunt.file.isDir(map.src)) {
      //     grunt.file.mkdir(map.dest);
      //     var files = grunt.file.expand({filter: 'isFile'}, )
      //   } else {
      //     grunt.file.copy(map.src, map.dest);
      //   }
      // });
      // grunt.log.write("Files copied to destination...");
      // grunt.log.ok();
    }





    // Merge task-specific and/or target-specific options with these defaults.
    // var options = this.options({
    //   punctuation: '.',
    //   separator: ', '
    // });

    // // Iterate over all specified file groups.
    // this.files.forEach(function(f) {
    //   // Concat specified files.
    //   var src = f.src.filter(function(filepath) {
    //     // Warn on and remove invalid source files (if nonull was set).
    //     if (!grunt.file.exists(filepath)) {
    //       grunt.log.warn('Source file "' + filepath + '" not found.');
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   }).map(function(filepath) {
    //     // Read file source.
    //     return grunt.file.read(filepath);
    //   }).join(grunt.util.normalizelf(options.separator));

    //   // Handle options.
    //   src += options.punctuation;

    //   // Write the destination file.
    //   grunt.file.write(f.dest, src);

    //   // Print a success message.
    //   grunt.log.writeln('File "' + f.dest + '" created.');
    // });
  });

};
