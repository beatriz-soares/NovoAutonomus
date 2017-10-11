"USE STRICT"

app.controller("monitoramentoController", function($scope, $location, dbService){
    $scope.frases = [];
    $scope.atualizar = function(){
        var query = "SELECT Frases.frase, Gestos.gesto, Gestos.nome_gif FROM Frases JOIN Gestos ON Frases.gesto=Gestos.id ORDER BY Gestos.id";
        dbService.runAsync(query, function(data){
          $scope.frases = data;
          console.log("Essas sao as novas frases");
          console.log($scope.frases);
        });
    };

    $scope.atualizar();

    $scope.editar = function(gesto){
        swal({
          title: "Modificar Frase",
          text: "Digite a nova frase para o gesto '"+gesto+"'",
          type: "input",
          showCancelButton: true,
          closeOnConfirm: false,
          animation: "slide-from-top",
          inputPlaceholder: "Nova frase",
          allowOutsideClick: true
        },
        function(inputValue){
          if (inputValue === false) return false;

          if (inputValue === "") {
            swal.showInputError("O campo de frase não deve estar em branco");
            return false
          }

          dbService.runAsync("UPDATE Frases SET frase = '"+inputValue+"' WHERE gesto == (SELECT id from Gestos where gesto == '"+gesto+"')", function(){});
        //   dbService.runAsync("INSERT INTO Frases ('frase','gesto') VALUES ('"+inputValue+"', (SELECT id from Gestos where gesto == '"+gesto+"'))", function(data){});

          swal("OK!", "Nova frase salva: " + inputValue, "success");
          t = setTimeout("location.reload()",3000);
        });

    };

    $scope.ilustrar = function(id_imagem){
        $scope.gesto = {"titulo": "'"+$scope.frases[id_imagem].gesto+"'", "imagem":$scope.frases[id_imagem].nome_gif};
    }
});
