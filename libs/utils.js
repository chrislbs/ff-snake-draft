'use strict';

var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    obj = {
        getModulesInDirectory: function (dirPath, ignorePrefixes) {
            /* Gets all of the .js files in a directory recursively. Files can be ingored by their
             * first character if that character is passed into the ignorePrefixes
             * argument (string || array)
             */

            var files = fs.readdirSync(dirPath),
                modules = [];
            // Convert ignorePrefixes into an array if it is a string
            ignorePrefixes = _.isString(ignorePrefixes) ? [ignorePrefixes] : ignorePrefixes;

            _.each(files, function(file) {
                var filePath = path.join(dirPath, file),
                    fileStat = fs.statSync(filePath);
                if (fileStat.isDirectory()) {
                    modules = modules.concat(obj.getModulesInDirectory(filePath, ignorePrefixes));
                } else {
                    // Only include .js files and don't include files that start with ignored prefixes
                    if (fileStat.isFile() &&
                        (ignorePrefixes === undefined || _.indexOf(ignorePrefixes, path.basename(file).charAt(0)) === -1) &&
                            path.extname(file) === '.js'
                       ) {
                           modules.push(filePath);
                       }
                }
            });
            return modules;
        }
    };

module.exports = obj;
