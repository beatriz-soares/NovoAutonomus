"USE STRICT"

var acao = true;

app.directive('clickTemporal', function() {
  return {
        link: function(scope, element, attrs) {
          var timer;
          element.bind('mouseenter', function($event) {
            if(!timer != null) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                if(acao) {
                    if ($event.target.nodeName == 'TEXTAREA') {
                        $($event.target).parent().parent().click()
                        $($event.target).focus();
                    }else{
                        $($event.target).trigger('click');
                    }
                };
            }, 600);
          });
          element.bind('mouseleave', function($event) {
            if(!timer != null) {
                clearTimeout(timer);
            }
          });
        }
    };
});

app.directive('mdPrevButton', function() {
  return {
        link: function(scope, element, attrs) {
          var timer;
          element.bind('mouseenter', function($event) {
            if(!timer != null) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                if(acao) {
                    $($event.target).trigger('click');
                };
            }, 600);
          });
          element.bind('mouseleave', function($event) {
            if(!timer != null) {
                clearTimeout(timer);
            }
          });
        }
    };
});

app.directive('mdNextButton', function() {
  return {
        link: function(scope, element, attrs) {
          var timer;
          element.bind('mouseenter', function($event) {
            if(!timer != null) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                if(acao) {
                    $($event.target).trigger('click');
                };
            }, 1500);
          });
          element.bind('mouseleave', function($event) {
            if(!timer != null) {
                clearTimeout(timer);
            }
          });
        }
    };
});


app.directive('linkHome', function() {
  return {
        link: function(scope, element, attrs) {
          element.bind('click', function($event) {
            window.href = '#/';
          });
        }
    };
});


app.directive('mdTabItem', function() {
  return {
        link: function(scope, element, attrs) {
          var timer;
          element.bind('mouseenter', function($event) {
            if(!timer != null) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
              if(acao) {
                  $($event.target).trigger('click');
              };
            }, 1500);
          });
          element.bind('mouseleave', function($event) {
            if(!timer != null) {
                clearTimeout(timer);
            }
          });
        }
    };
});


app.directive('startStop', function() {
    return {
        link: function(scope, element, attrs) {
            var timer;
            element.bind('mouseenter', function($event) {
                if(!timer != null) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
                    if(acao){
                        acao = false;
                        $($event.target).text('Iniciar Ações');
                    }else{
                        acao = true;
                        $($event.target).text('Pausar Ações');
                    };

                }, 1500);
            });
            element.bind('mouseleave', function($event) {
                if(!timer != null) {
                    clearTimeout(timer);
                }
            });
        }
    };
});

app.controller("dashboardController", function($scope, $location){

});
