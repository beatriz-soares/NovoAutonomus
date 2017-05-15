"USE STRICT"

function say_espeak (text) {
    if(process.platform == 'darwin') {
        exec("say '" + text + "'");
    }else if(process.platform == 'linux'){
        exec("espeak -v pt+m2 -p 50 -s 150 '" + text + "'");
    }

}

function say (text, callback) {
  say_espeak(text);

  if (callback != undefined) {
    callback();
  }
}

function cancelSay(timer)
{
    if(!timer != null)
      {
          clearTimeout(timer);
      }
}

app.directive('say', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            element.bind('click', function($event) {
                say(element.text());
            });
        }
    }
});

app.directive('sayHover', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            element.bind('mouseenter', function($event) {
                say(element.text());
            });
        }
    }
});

app.directive('cancelSay', function(){
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            element.bind('mouseleave', function($event) {
                cancelSay();
            });
        }
    }
});

app.directive('scrollOnHover', function() {
  return {
    restrict: 'A',
    link: function(scope, $elm, attrs) {


      $elm.on('mouseenter', function(event) {
        console.log($elm.position().top);
        $('#frases-favoritas').stop().animate({scrollTop: $elm.position().top - $('#frases-favoritas').height() / 3}, "slow");
        return false;
      });
    }
  }
});

app.directive('scrollToTop', function() {
  return {
    restrict: 'A',
    link: function(scope, $elm, attrs) {
      $elm.on('mouseenter', function(event) {
        $('#frases-favoritas').stop().animate({scrollTop: 0 }, "slow");
        return false;
      });
    }
  }
});

app.controller("frasesController", function($scope, $location){
	//Listando
	$scope.say = function(text) {
    say(text);
  };

  var timer;

  $scope.sayHover = function(text)
  {
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
