"USE STRICT"
app.controller("controleRemotoController", function($scope, $location, $mdDialog, dbService){
  //Controles
  $scope.listaControles = function(){
  		dbService.runAsync("SELECT controle.id, controle.nome FROM controle", function(data){
  			$scope.controles = data;
  		});
  	};

  $scope.listaBotoes = function(controle_id){
    dbService.runAsync("SELECT * FROM botao WHERE botao.controle_id = " + controle_id, function(data){
      $scope.botoes = {};

      data.forEach(function(elm){
        $scope.botoes[elm.nome] = elm;
      });

      console.log($scope.botoes);
      $scope.bool = 1;
    });
  };

  $scope.carregar_portas = function(){
		arduino.portList(function (ports) {
		 $scope.portas = ports;
		});
	};

	if (! arduino.isOpened) {
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('body')))
        .clickOutsideToClose(true)
        .title('Erro')
        .textContent('Dispositivo não conectado.')
        .ariaLabel('Erro')
        .ok('Fechar')
    );
	} else {
		$scope.model = arduino.port.path;
    if (arduino.mode == 2)
		  arduino.setMode(1);
	}

	$scope.selecionar_porta = function(){
		arduino.connect($scope.model);
	}

  $scope.enviar_codigo = function(codigo){
    arduino.write(codigo.slice(1, codigo.length - 1));
  };


  // Eventos
  Evento.on('erro_porta', function(){
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('body')))
        .clickOutsideToClose(true)
        .title('Erro')
        .textContent('Dispositivo não conectado.')
        .ariaLabel('Erro')
        .ok('Fechar')
    );
  });


});
