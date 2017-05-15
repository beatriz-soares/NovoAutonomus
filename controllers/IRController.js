"USE STRICT"

app.controller("IRController", function($scope, $location, $mdDialog, dbService){
	$scope.model = '';

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
		arduino.setMode(2);
	}

	$scope.selecionar_porta = function(){
		console.log($scope.model);
		arduino.connect($scope.model);
	}

	$scope.lista_teclas = [
		{
			name: 'Power',
			icon: '&#xE8AC;'
		},
		{
			name: 'Volume +',
			icon: '&#xE050;'
		},
		{
			name: 'Volume -',
			icon: '&#xE04D;'
		},
		{
			name: 'Mute',
			icon: '&#xE04E;'
		},
		{
			name: 'Canal +',
			icon: '&#xE145;'
		},
		{
			name: 'Canal -',
			icon: '&#xE15B;'
		},
		{
			name: 'Play',
			icon: '&#xE037;'
		},
		{
			name: 'Pause',
			icon: '&#xE034;'
		},
		{
			name: 'Stop',
			icon: '&#xE047;'
		},
		{
			name: 'Número 0',
			icon: '1'
		},
		{
			name: 'Número 1',
			icon: '1'
		},
		{
			name: 'Número 2',
			icon: '2'
		},
		{
			name: 'Número 3',
			icon: '3'
		},
		{
			name: 'Número 4',
			icon: '4'
		},
		{
			name: 'Número 5',
			icon: '5'
		},
		{
			name: 'Número 6',
			icon: '6'
		},
		{
			name: 'Número 7',
			icon: '7'
		},
		{
			name: 'Número 8',
			icon: '8'
		},
		{
			name: 'Número 9',
			icon: '9'
		},
		{
			name: 'Menu',
			icon: '&#xE5D2;'
		},
		{
			name: 'OK',
			icon: 'OK'
		},
		{
			name: 'Seta de cima',
			icon: '&#xE316;'
		},
		{
			name: 'Seta da esquerda',
			icon: '&#xE314;'
		},
		{
			name: 'Seta de baixo',
			icon: '&#xE313;'
		},
		{
			name: 'Seta da direita',
			icon: '&#xE315;'
		},
		{
			name: 'Smart',
			icon: '&#xE039;'
		}

	];

	$scope.current_id = 0;
	$scope.finalizar = false;
	$scope.nome_controle = undefined;

	$scope.salvar_teclas = function(){
		if ($scope.nome_controle != undefined) {
			var id = dbService.insert('controle', {nome: $scope.nome_controle});

			$scope.lista_teclas.forEach(function(b) {
				if (b.name != undefined && b.data != undefined)
					dbService.insert('botao', {nome: b.name, controle_id: id, codigo: b.data});
			});
		} else {
			$mdDialog.show(
	      $mdDialog.alert()
	        .parent(angular.element(document.querySelector('body')))
	        .clickOutsideToClose(true)
	        .title('Erro')
	        .textContent('Digite o nome do novo controle.')
	        .ariaLabel('Erro')
	        .ok('Fechar')
	    );
		}
	};

	$scope.adicionar_tecla = function(){
		$scope.lista_teclas.push({
			name: undefined,
			icon: '&#xE8B9;'
		});
		$scope.current_id = $scope.current_id + 1;

		$scope.$apply();
	};

	arduino.events.on('code', function(data){
		$scope.lista_teclas[$scope.current_id].data = data;
		if ($scope.current_id < $scope.lista_teclas.length - 1) {
			$scope.current_id = $scope.current_id + 1;
		}

		$scope.$apply();
	});

});
