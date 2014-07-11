require.config({
    paths:{
        underscore:'lib/underscore.min',
        paper:'lib/paper-full.min'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        paper: {
            exports: 'paper'
        }
    }
});

define("jquery", ["http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"]);
define("jquery-ui", ["jquery", "http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js"]);
define("less", ["http://cdnjs.cloudflare.com/ajax/libs/less.js/1.7.0/less.min.js"]);
define(["underscore", "lib/class", "jquery", "jquery-ui", "less"], function(_){
    require(["app"]);
});
