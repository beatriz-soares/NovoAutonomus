"USE STRICT"

app.controller("tecladoController", function($scope, $location, dbService){
    $scope.frase_total = "";
    $scope.palavra_atual = "";
    $scope.palavras = [""];
    $scope.linha = 1;
    $scope.coluna = 1;
    $scope.alfabeto = [['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                      ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
                      ['O', 'P', 'Q', 'R', 'S', 'T', 'U'],
                      ['V', 'W', 'X', 'Y', 'Z', 'Ç', ' '],
                      ['1', '2', '3', '4', '5', '6', '7'],
                      ['8', '9', '0', '. ', ', ', '? ', '! ']];


    // Retirar bug
    // dbService.runAsync(`SELECT * FROM ocorrencias`, function(){});
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
          $scope.alfabeto = [['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                            ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
                            ['O', 'P', 'Q', 'R', 'S', 'T', 'U'],
                            ['V', 'W', 'X', 'Y', 'Z', 'Ç', ' '],
                            ['1', '2', '3', '4', '5', '6', '7'],
                            ['8', '9', '0', '. ', ', ', '? ', '! ']];
        }
        else if (atual == "minu"){
          $scope.alfabeto = [['a', 'b', 'c', 'd', 'e', 'f', 'g'],
                            ['h', 'i', 'j', 'k', 'l', 'm', 'n'],
                            ['o', 'p', 'q', 'r', 's', 't', 'u'],
                            ['v', 'w', 'x', 'y', 'z', 'ç', ' '],
                            ['1', '2', '3', '4', '5', '6', '7'],
                            ['8', '9', '0', '. ', ', ', '? ', '! ']];
        }
        else if (atual == "acento"){
          $scope.alfabeto = [['á', 'à', 'ã', 'â', 'À', 'Á', 'Ã'],
                            ['Â', 'É', 'é', 'í', 'Í', 'ú', 'Ú'],
                            ['Ó', 'ó', 'õ', 'Õ', 'ô', 'Õ', 'Ê'],
                            ['ê', '', '', '', '', '', ' '],
                            ['1', '2', '3', '4', '5', '6', '7'],
                            ['8', '9', '0', '. ', ', ', '? ', '! ']];
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
      $("textarea").scrollTop($("textarea")[0].scrollHeight);
    }

    $scope.pula_linha = function(muda) {
        $scope.linha=muda;
        $("td").css("color", "black");
        $("th[scope='row']").removeClass("ativo");
        $("th[linha="+ muda + "]").addClass("ativo");
        $("td[linha="+ muda + "][coluna="+$scope.coluna+"]").css("color", "red");

     };

   $scope.pula_coluna = function(muda) {
         $("td").css("color", "black");
        $("th[data-id='coluna']").removeClass("ativo");
        $("th[coluna="+ muda + "]").addClass("ativo");
        $("td[linha="+ $scope.linha + "][coluna="+muda+"]").css("color", "red");
        $scope.coluna=muda;
    };

  $scope.adicionar_tecla = function(a) {

    if (a == 'enter'){
      var tecla = "\n";
    }
    else{
      var tecla = $scope.alfabeto[$scope.linha-1][$scope.coluna-1];
    }
    if (tecla == ". " || tecla == ", "){
      salvar();
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
      pesquisar();
      $("textarea").scrollTop($("textarea")[0].scrollHeight);
    }

  $scope.backspace = function() {
    $scope.frase_total = $scope.frase_total.substring(0,$scope.frase_total.length - 1);
    pesquisar();
    var fs = require('fs');
    fs.writeFile('texto.txt', $scope.frase_total, function (err) {
      if (err) {
        console.log(err);
      } else {
        // done
      }
      });
    }

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
});
