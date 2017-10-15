"USE STRICT"

app.controller("monitoramentoController", function($scope, $location, dbService){
    $scope.frases = [];
    $scope.imagem_atual = ["piscar", "Piscar"];
    $scope.atualizar = function(){
        $scope.gesto = {"titulo": "'Piscar'"};
        var query = "SELECT Frases.frase, Gestos.gesto, Gestos.nome_gif FROM Frases JOIN Gestos ON Frases.gesto=Gestos.id ORDER BY Gestos.id";
        dbService.runAsync(query, function(data){
          $scope.frases = data;
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
        $scope.gesto = {"titulo": "'"+$scope.frases[id_imagem].gesto+"'"};
        // responsiveVoice.speak($scope.frases[id_imagem].frase, "Brazilian Portuguese Female");
        $scope.imagem_atual = [$scope.frases[id_imagem].nome_gif, $scope.frases[id_imagem].gesto];
    }

    $(".form-input").mouseenter(function(){
        imagem_id = parseInt($(this).children().eq(0).children().eq(0).attr("id")[6])-1;
        $("img").parent().html("Veja abaixo como o gesto '" +$scope.frases[imagem_id].gesto+ "\
              ' é realizado. <hr> <img src='static/images/"+$scope.frases[imagem_id].nome_gif+".gif'\
              style='width:400px;height:500px;'>");
    }).mouseleave(function(){
        $("img").parent().html("Veja abaixo como o gesto '" +$scope.imagem_atual[1]+ "\
            ' é realizado. <hr> <img src='static/images/"+$scope.imagem_atual[0]+".gif'\
            style='width:400px;height:500px;'>");
    });
});
