var util = require('util');

(function () {
    "use strict";

    // All this exception class mumbo-jumbo, taken from
    // http://dustinsenos.com/articles/customErrorsInNode
    var RoboHydraException = function(message, constr) {
        Error.captureStackTrace(this, constr || this);
        this.message = message || "Error";
    };
    util.inherits(RoboHydraException, Error);
    RoboHydraException.prototype.name = "RoboHydraException";

    function makeException(name, baseClass, messageFunction) {
        var newException = function() {
            var message = messageFunction.apply(null, arguments);
            newException.super_.call(this, message, this.constructor);
        };
        util.inherits(newException, baseClass);
        newException.prototype.name = name;
        return newException;
    }

    var InvalidRoboHydraResponseException = makeException(
        "InvalidRoboHydraResponseException",
        RoboHydraException,
        function(msg) {
            return 'No "end" event handler for this response object' || msg;
        }
    );

    var InvalidRoboHydraResponseEventException = makeException(
        "InvalidRoboHydraResponseEventException",
        RoboHydraException,
        function(eventName) {
            return 'There is no "' + eventName + '" event';
        }
    );

    var InvalidRoboHydraRequestException = makeException(
        "InvalidRoboHydraRequestException",
        RoboHydraException,
        function(propName, propValue) {
            return 'Invalid request: property "' + propName +
                '" had value "' + propValue + '"';
        }
    );

    var InvalidRoboHydraHeadException = makeException(
        "InvalidRoboHydraHeadException",
        RoboHydraException,
        function(message) {
            return message || "Invalid or incomplete RoboHydra Head";
        }
    );

    var InvalidRoboHydraHeadStateException = makeException(
        "InvalidRoboHydraHeadStateException",
        RoboHydraException,
        function(attachedState) {
            return "Can't execute that operation when the hydra head is " +
                attachedState ? "attached" : "detached";
        }
    );

    var InvalidRoboHydraPluginException = makeException(
        "InvalidRoboHydraPluginException",
        RoboHydraException,
        function() {
            return "Invalid or incomplete plugin";
        }
    );

    var DuplicateRoboHydraPluginException = makeException(
        "DuplicateRoboHydraPluginException",
        RoboHydraException,
        function() {
            return "Duplicate or incomplete plugin";
        }
    );

    var DuplicateRoboHydraHeadNameException = makeException(
        "DuplicateRoboHydraHeadNameException",
        RoboHydraException,
        function(head) {
            return 'Duplicate RoboHydra head name "' + head + '"';
        }
    );

    var RoboHydraHeadNotFoundException = makeException(
        "RoboHydraHeadNotFoundException",
        RoboHydraException,
        function(pluginName, headName) {
            return 'Could not find the given head ("' +
                pluginName + '" / "' + headName + '")';
        }
    );

    var RoboHydraPluginNotFoundException = makeException(
        "RoboHydraPluginNotFoundException",
        RoboHydraException,
        function(pluginName) {
            return 'Could not find the given plugin ("' + pluginName + '")';
        }
    );

    var InvalidRoboHydraTestException = makeException(
        "InvalidRoboHydraTestException",
        RoboHydraException,
        function(pluginName, testName) {
            return 'Could not find the given test ("' +
                pluginName + '" / "' + testName + '")';
        }
    );

    var InvalidRoboHydraNextParametersException = makeException(
        "InvalidRoboHydraNextParametersException",
        RoboHydraException,
        function(plugin, test, args) {
            return 'Invalid parameters passed to the next ' +
                'function "' + plugin.name + '" / "' +
                test.name + '". Expected (req, res), ' +
                'received ' + args.length + ' parameters: (' +
                Array.prototype.join.call(args, ", ") + ')';
        }
    );

    exports.RoboHydraException = RoboHydraException;
    exports.InvalidRoboHydraResponseEventException = InvalidRoboHydraResponseEventException;
    exports.InvalidRoboHydraRequestException = InvalidRoboHydraRequestException;
    exports.InvalidRoboHydraResponseException = InvalidRoboHydraResponseException;
    exports.InvalidRoboHydraHeadException = InvalidRoboHydraHeadException;
    exports.InvalidRoboHydraHeadStateException = InvalidRoboHydraHeadStateException;
    exports.InvalidRoboHydraPluginException = InvalidRoboHydraPluginException;
    exports.DuplicateRoboHydraPluginException = DuplicateRoboHydraPluginException;
    exports.DuplicateRoboHydraHeadNameException = DuplicateRoboHydraHeadNameException;
    exports.RoboHydraHeadNotFoundException = RoboHydraHeadNotFoundException;
    exports.RoboHydraPluginNotFoundException = RoboHydraPluginNotFoundException;
    exports.InvalidRoboHydraTestException = InvalidRoboHydraTestException;
    exports.InvalidRoboHydraNextParametersException = InvalidRoboHydraNextParametersException;
}());
