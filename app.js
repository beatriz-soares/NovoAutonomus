"USE STRICT"

var app = angular.module('cdg', ['ngMaterial', 'angular-carousel', 'ngTouch', 'ngRoute'])
.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('docs-dark');
  $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
  $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
  $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
  $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
  $mdThemingProvider.theme('dark-blue-grey').backgroundPalette('blue-grey').dark();

}).filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}).config(function($routeProvider){
	$routeProvider.when("/", {
		templateUrl : "views/novo_teclado.html",
		controller: "tecladoController"
	});
});

var exec = require('child_process').exec;
var EventEmitter = require('events');
var SerialPort = require('serialport');

var spawn = require('child_process').spawn;

var Evento = new EventEmitter();

var arduino = require('./services/arduino.js');

arduino.init();

arduino.events.on('connect', function(){
  console.log('Conectado com sucesso à porta');
});

arduino.events.on('arduino', function(){
  console.log('Conectado com sucesso ao arduino');
});

arduino.events.on('sent', function (data){
  console.log('Data sent: ');
  console.log(data);
});

arduino.events.on('data', function (data){
  console.log(data);
});
