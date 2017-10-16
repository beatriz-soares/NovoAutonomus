"USE STRICT"

app.controller("monitoramentoController", function($scope, $location, dbService){
    $scope.frases = [];
    var inicio = true;

    $scope.imagem_atual = ["piscar", "Piscar"];
    $scope.atualizar = function(){
        $scope.gesto = {"titulo": "'Piscar'"};
        var query = "SELECT Frases.frase, Gestos.gesto, Gestos.selecionado, Gestos.nome_gif FROM Frases JOIN Gestos ON Frases.gesto=Gestos.id ORDER BY Gestos.id";
        dbService.runAsync(query, function(data){
          $scope.frases = data;
        });
    };

    $scope.atualizar();

    var pupil_remote = require('pupil-remote');
    var child_process_1 = require("child_process");
    var receiver = new pupil_remote.MessageReceiver('127.0.0.1', 50020, 2);
    var TTS = require("./services/TTS");

    receiver.on('blinks', function(dados){
        if(dados['topic'] == 'abrir_boca'){
          console.log("dando certo");
        }

        for (var key in $scope.frases){
          if ($scope.frases[key].nome_gif==dados.topic){
            if ($("#input-"+(parseInt(key)+1)).is(':checked')){
              console.log("vai dar play");
              TTS.Sintetizador($scope.frases[key].frase);
            }
          }
        }
    })

    $scope.checkboxes = function(){
      if (inicio){
          for (var i=0; i<$scope.frases.length; i++){
            $(".descricao").each(function(){
              if ($(this).text()==$scope.frases[i].frase && $scope.frases[i].selecionado=="checked"){
                id_input = $(this).parent().attr("for");
                $("#"+id_input).attr("checked", "checked");
              }
            });
            }
            inicio = false;
          }
      }

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
        if ($("#input-"+(id_imagem+1)).is(':checked')){
          dbService.runAsync("UPDATE Gestos SET selecionado = 'checked' WHERE gesto\
                              == '"+$scope.frases[id_imagem].gesto+"'", function(){});
        }
        else{
          dbService.runAsync("UPDATE Gestos SET selecionado = 'false' WHERE gesto\
                              == '"+$scope.frases[id_imagem].gesto+"'", function(){});
        }
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
