function MultiHydra(pluginConfiguration, opts) {
    this.extraVars = opts.extraVars || {};
    this.rootDir = opts.rootDir ? fs.realpathSync(opts.rootDir) : '';
    this.hydras = {};
    this._pluginLoadPath = ['robohydra/plugins',
                            'node_modules/robohydra/plugins',
                            '/usr/local/share/robohydra/plugins',
                            '/usr/share/robohydra/plugins'];
    if (opts.extraPluginLoadPath) {
        this._pluginLoadPath.unshift(opts.extraPluginLoadPath);
    }
    this.pluginInfoList = this._initPlugins(pluginConfiguration);
    this.authenticatorFunction =
        this._getAuthenticatorFunction(this.pluginInfoList) ||
        function() { return "*default*"; };
}
MultiHydra.prototype._getAuthenticatorFunction = function(pluginInfoList) {
    var found = false, authenticatorFunction;
    pluginInfoList.forEach(function(pluginInfo) {
        if ("getAuthenticationFunction" in pluginInfo.module) {
            if (found) {
                throw new InvalidRoboHydraPluginException();
            } else {
                found = true;
                authenticatorFunction =
                    pluginInfo.module.getAuthenticationFunction(
                        pluginInfo.config
                    );
            }
        }
    });
    return authenticatorFunction;
};
// Returns an array of plugin information objects for the plugins
// mentioned in the given configuration. Each plugin information
// object contains the keys 'name', 'path', 'config' and 'module'.
MultiHydra.prototype._initPlugins = function(pluginConfiguration) {
    var self = this;
    return pluginConfiguration.map(function(pluginNameAndConfig) {
        var pluginName   = pluginNameAndConfig[0],
            pluginConfig = pluginNameAndConfig[1],
            plugin;

        try {
            plugin = self._requirePlugin(pluginName);
        } catch(e) {
            if (e instanceof RoboHydraPluginNotFoundException) {
                console.log("Could not find or load plugin '"+pluginName+"'");
            } else {
                console.log("Unknown error loading plugin '"+pluginName+"'");
            }
            throw e;
        }

        plugin.name = pluginName;
        plugin.config = pluginConfig;
        return plugin;
    });
};
MultiHydra.prototype.getHydraForRequest = function(req) {
    var username = this.authenticatorFunction(req);

    if (! (username in this.hydras)) {
        this.hydras[username] = this._createHydra(username);
    }

    return this.hydras[username];
};
MultiHydra.prototype._createHydra = function(username) {
    var hydra = new RoboHydra(this.extraVars);

    var self = this;
    this.pluginInfoList.forEach(function(pluginInfo) {
        hydra.registerPluginObject(pluginInfo);
    });

    return hydra;
};
// Return an object with keys 'module' and 'path'. It throws an
// exception RoboHydraPluginNotFoundException if the plugin could not
// be found.
MultiHydra.prototype._requirePlugin = function(name) {
    opts = opts || {};
    var plugin = {};
    var stat, fullPath;
    for (var i = 0, len = this._pluginLoadPath.length; i < len; i++) {
        try {
            fullPath = this.rootDir +
                (this._pluginLoadPath[i].indexOf('/') !== 0 ?
                     fs.realpathSync('.') + '/' : '') +
                this._pluginLoadPath[i] + '/' + name;
            stat = fs.statSync(fullPath);
        } catch (e) {
            // It's ok if the plugin is not in this directory
            if (e.code !== 'ENOENT') {
                throw e;
            }
        }
        if (stat && stat.isDirectory()) {
            plugin.module = require(fullPath);
            break;
        }
    }
    if (plugin.module) {
        plugin.path = fullPath;
        return plugin;
    } else {
        throw new RoboHydraPluginNotFoundException(name);
    }
};


exports.MultiHydra = MultiHydra;
