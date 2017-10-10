"USE STRICT"

app.controller("monitoramentoController", function($scope, $location, dbService){
    $scope.frases = [];

    $scope.atualizar = function(){
        var query = "SELECT Frases.frase, Gestos.gesto FROM Frases JOIN Gestos ON Frases.gesto=Gestos.id";
        console.log(query);
        dbService.runAsync(query, function(data){
          $scope.frases = data;
          console.log(data);
        });
    };
    $scope.atualizar();

    $scope.teste = function(gesto){
        swal({
          title: "Modificar Frase",
          text: "Digite a nova frase para o gesto",
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

          var query = "UPDATE Frases SET gesto = NULL WHERE gesto == (SELECT id from Gestos where gesto == '"+gesto+"')"
          dbService.runAsync(query, function(data){});
          var query = "INSERT INTO Frases ('frase','gesto') VALUES ('"+inputValue+"', (SELECT id from Gestos where gesto == '"+gesto+"'))"
          dbService.runAsync(query, function(data){});
          swal("OK!", "Nova frase salva: " + inputValue, "success");
        });
    };
});
