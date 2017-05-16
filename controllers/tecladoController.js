"USE STRICT"

app.controller("tecladoController", function($scope, $location, dbService){
    $scope.frase_total = "";
    $scope.palavra_atual = "";
    $scope.palavras = [""];
    $scope.linha = 1;
    $scope.coluna = 1;
    $scope.alfabeto = [['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç'],
                      ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '?']];


    // Retirar bug
    // dbService.runAsync(`SELECT * FROM ocorrencias`, function(){});

    $("td[linha=1][coluna=1]").css("color", "red");

    function inserir_texto(titulo, texto, callback) {

      var q1 = `SELECT * FROM texto WHERE titulo = '${titulo}'`;

      dbService.runAsync(q1, function(data){
        var query = "";
        if (data.length > 0){
          query = `UPDATE texto SET texto = '${texto}', data = '${new Date().toISOString()}' WHERE titulo = '${titulo}'`;
        } else {
          query = `INSERT INTO texto (texto, data, titulo) VALUES ('${texto}', '${new Date().toISOString()}', '${titulo}')`;
        }

        dbService.runAsync(query, function(data){
          callback(data);
        });
      });
  	}



    dbService.runAsync("SELECT * FROM texto WHERE titulo = 'livro'", function(data){
      if (data.length>0){
        $scope.frase_total = data[0].texto;
      }
    });

    function pesquisar() {
      // Retira os sinais
      var split = $scope.frase_total.toLowerCase().replace(/[\'"<>!@#$%&*().,:;\/=?\[\]\\\+\|]+|[-+\s]/g, ' ').replace(/\s+/g, ' ').split(' ');

      var penultima_palavra = '@%';

      if (split.length > 1) penultima_palavra = split[split.length - 2];

      //console.log(split);

      var ultima_palavra = split[split.length - 1];
      if (' '.indexOf(`[\'"<>!@#$%&*().,:;\/=?\[\]\\\+\|] `) >= 0) ultima_palavra = '';

      var query = `SELECT secundaria.texto,
        secundaria.texto LIKE '${ultima_palavra}%' AS encontrada,
        COALESCE(cadeia.ocorrencias, 0.0) AS ocorrencia,
        COALESCE(1.0 * COALESCE(cadeia.ocorrencias, 0.0) / (SELECT SUM(ocorrencias) FROM cadeia WHERE cadeia.primaria_id = (SELECT id FROM palavra WHERE texto LIKE '${penultima_palavra}' COLLATE NOACCENTS )), 0.0) AS probabilidade
        FROM palavra secundaria
        LEFT JOIN cadeia ON cadeia.primaria_id = (SELECT id FROM palavra WHERE texto LIKE '${penultima_palavra}' COLLATE NOACCENTS) AND cadeia.secundaria_id = secundaria.id
        WHERE secundaria.texto != '@'
        ORDER BY encontrada DESC,  probabilidade DESC, ocorrencia DESC, secundaria.ocorrencias DESC
        LIMIT 5;`;

      //console.log(query);

      dbService.runAsync(query, function(data){
        $scope.palavras = data;
        if (!data.length)
          data.push("")
      });

    }

    $scope.zerar = function(atual) {
        if (atual == "maiu"){
          $scope.alfabeto = [['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç'],
                            ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '?']];
        }
        else if (atual == "minu"){
          $scope.alfabeto = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç'],
                            ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?']];
        }
        else if (atual == "acento"){
          $scope.alfabeto = [['á', 'à', 'ã', 'â', 'À', 'Á', 'Ã', 'Â', 'É', 'é'],
                            ['í', 'Í', 'ú', 'Ú', 'Ó', 'ó', 'õ', 'Õ', 'ô', 'Õ'],
                            ['Ê', 'ê', 'c', 'v', 'b', 'n', 'm', ',', '.', '?']];
        }
        else if (atual == "numero"){
          $scope.alfabeto = [['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
                            ['+', '/', '*', '$', '%', '(', ')', 'º', 'ª', '='],
                            ['', '', '', '', '', '', '', '', '', '']];
        }
        else if (atual == "ponto"){
          $scope.alfabeto = [['.', ',', ':', ';', '-', '_', '/', '"', "'", ''],
                            ['?', '!', '*', '$', '%', '(', ')', 'º', 'ª', ''],
                            ['', '', '', '', '', '', '', '', '', '']];
        }

    }

    $scope.voltar = function() {
        $scope.zerar("minu");
    };

    $scope.add_palavra = function(palavra) {
      var split = $scope.frase_total.split(' ');

      split[split.length - 1] = palavra;

      $scope.frase_total = split.join(" ");

      $scope.frase_total  += " ";
      pesquisar();
      $scope.voltar();
    }

    $scope.pula_linha = function(muda) {
      $("td").css("color", "black");
       if (muda == 'mais' && $scope.linha<3){
        $scope.linha += 1;
      }
      else if (muda == 'menos' && $scope.linha>1) {
        $scope.linha -= 1;
      }
      var a = $("td[linha="+ $scope.linha + "][coluna="+ $scope.coluna + "]").css("color", "red");
   };

   $scope.pula_coluna = function(muda) {
     $("td").css("color", "black");
      if (muda == 'mais' && $scope.coluna<10){
       $scope.coluna += 1;
     }
     else if (muda == 'menos' && $scope.coluna>1) {
       $scope.coluna -= 1;
     }
     var a = $("td[linha="+ $scope.linha + "][coluna="+ $scope.coluna + "]").css("color", "red");
  };

  $scope.adicionar_tecla = function(a) {

    if (a == ' '){
      var tecla = " ";
    }
    else if (a == 'enter'){
      var tecla = "\n";
    }
    else{
      var tecla = $scope.alfabeto[$scope.linha-1][$scope.coluna-1];
    }

    $scope.frase_total += tecla;

    var fs = require('fs');
    fs.appendFile('texto.txt', tecla, function (err) {
      if (err) {
        console.log(err);
      } else {
        // done
      }
      });
      $scope.voltar();

      inserir_texto('livro', $scope.frase_total, function(data){
        console.log(data);
      });
  }

  $scope.backspace = function() {
    $scope.frase_total = $scope.frase_total.substring(0,$scope.frase_total.length - 1);
    var fs = require('fs');
    fs.writeFile('texto.txt', $scope.frase_total, function (err) {
      if (err) {
        console.log(err);
      } else {
        // done
      }
      });
    }


  $scope.say_n_save = function(){

      function salvar() {
        // Só funciona com o banco atual, presume que o delimitador de início de frase está salvo na primeira posição
        var anterior = 1, split = $scope.frase_total.toLowerCase().replace(/[\'"<>!@#$%&*().,:;\/=?\[\]\\\+\|]+|[-+\s]/g, ' ').replace(/\s+/g, ' ').replace(/\s+$/g, '').split(' ');

        split.forEach(function(i){
          dbService.runAsync(`SELECT * FROM palavra WHERE texto = '${i}';`, function(data){
              if (data.length){
                 dbService.runAsync(`UPDATE palavra SET ocorrencias = ${data[0]}.ocorrencias + 1} WHERE id = ${data[0].id}`, function(){});
                 dbService.runAsync(`INSERT INTO ocorrencia (primaria_id, secundaria_id, data) VALUES(${anterior}, ${data[0].id}, '${new Date().toISOString()}');`, function(){});
                 anterior = data[0].id;
              }else{
                  dbService.runAsync(`INSERT INTO palavra (texto, ocorrencias, data) VALUES('${i}',1,'${new Date().toISOString()}');`, function(data){
                    dbService.runAsync(`INSERT INTO ocorrencia (primaria_id, secundaria_id, data) VALUES(${anterior}, ${data}, '${new Date().toISOString()}');`, function(){});
                    anterior = data;
                  });
              }
          });
    		});
      }

      say($scope.frase_total, salvar);
  }
});
