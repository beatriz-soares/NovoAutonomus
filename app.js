"USE STRICT"

var app = angular.module('cdg', ['ngRoute'])
.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]).filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}).config(function($routeProvider){
	$routeProvider.when("/", {
		templateUrl : "views/menu_monitoramento.html",
		controller: "monitoramentoController"
	});
});

var exec = require('child_process').exec;
var EventEmitter = require('events');
// var SerialPort = require('serialport');

var spawn = require('child_process').spawn;

var Evento = new EventEmitter();
