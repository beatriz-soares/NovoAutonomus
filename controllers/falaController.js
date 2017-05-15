"USE STRICT"

app.controller("falaController", function($scope, $location){
    $scope.fala = "";

    $scope.limpar = function(text) {
        $scope.fala = "";
    };

    $scope.say = function(text) {
        say(text);
    };
    var timer;

    $scope.sayHover = function(text){
        if(!timer != null)
        {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            say(text);
        }, 1500);

    };

    $scope.cancelSay = function(){
        cancelSay(timer);
    };

});
