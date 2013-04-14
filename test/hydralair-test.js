/*global require, describe, it, expect*/

var buster = require("buster");
var HydraLair = require('../lib/hydralair').HydraLair;

buster.spec.expose();

describe("Plugin loader", function() {
    "use strict";

    it("fails when loading non-existent plugins", function() {
        expect(function() {
            new HydraLair(
                [{name: 'i-dont-exist', config: {}}],
                {rootDir: __dirname + '/plugin-fs'}
            );
        }).toThrow('RoboHydraPluginNotFoundException');
    });

    it("can load a simple plugin", function() {
        var configKeyValue = 'config value';
        var rootDir = __dirname + '/plugin-fs';
        var lair = new HydraLair(
            [{name: 'simple', config: {configKey: configKeyValue}}],
            {rootDir: rootDir}
        );
        expect(lair.pluginInfoList[0].path).toEqual(
            rootDir + '/usr/share/robohydra/plugins/simple');
        expect(lair.pluginInfoList[0].config.configKey).toEqual(configKeyValue);
    });

    it("loads plugins in the right order of preference", function() {
        var rootDir = __dirname + '/plugin-fs';
        var lair = new HydraLair(
            [{name: 'definedtwice', config: {}}],
            {rootDir: rootDir}
        );
        expect(lair.pluginInfoList[0].path).toEqual(
            rootDir + '/usr/local/share/robohydra/plugins/definedtwice');
    });

    it("can define own load path, and takes precedence", function() {
        var rootDir = __dirname + '/plugin-fs';
        var lair = new HydraLair(
            [{name: 'definedtwice', config: {}}],
            {rootDir: rootDir,
             extraPluginLoadPaths: ['/opt/robohydra/plugins']}
        );
        expect(lair.pluginInfoList[0].path).toEqual(
            rootDir + '/opt/robohydra/plugins/definedtwice');
    });

    it("can define more than one load path, latest has precedence", function() {
        var rootDir = __dirname + '/plugin-fs';
        var lair = new HydraLair(
            [{name: 'definedtwice', config: {}}],
            {rootDir: rootDir,
             extraPluginLoadPaths: ['/opt/robohydra/plugins',
                                    '/opt/project/robohydra-plugins']}
        );
        expect(lair.pluginInfoList[0].path).toEqual(
            rootDir + '/opt/project/robohydra-plugins/definedtwice');
    });

    it("can define more than one load path, first is still valid", function() {
        var rootDir = __dirname + '/plugin-fs';
        var lair = new HydraLair(
            [{name: 'customloadpath', config: {}}],
            {rootDir: rootDir,
             extraPluginLoadPaths: ['/opt/robohydra/plugins',
                                    '/opt/project/robohydra-plugins']}
        );
        expect(lair.pluginInfoList[0].path).toEqual(
            rootDir + '/opt/robohydra/plugins/customloadpath');
    });
});
