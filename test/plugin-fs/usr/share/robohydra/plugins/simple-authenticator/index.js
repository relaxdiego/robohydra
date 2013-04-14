var RoboHydraHeadStatic = require("robohydra").heads.RoboHydraHeadStatic;

exports.getBodyParts = function(conf) {
    "use strict";

    return {
        heads: [
            new RoboHydraHeadStatic({
                content: "Default head for simple authenticator plugin"
            })
        ]
    };
};

exports.getAuthenticationFunction = function() {
    return function() {
        return "simple-authenticator-fixed-user";
    };
};
