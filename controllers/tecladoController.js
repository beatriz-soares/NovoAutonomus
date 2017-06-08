"USE STRICT"
// Importação das dependências
const pupil = require('pupil-remote');
const fs = require('fs');

app.controller("tecladoController", function($scope, $location, dbService){
  // Criação do receptor dos dados do pupil
  let receiver = new pupil.MessageReceiver('127.0.0.1', 50020);

  $scope.frase_total = "";
  $scope.palavra_atual = "";
  $scope.palavras = ["", ""];
  $scope.linha = -1;
  $scope.coluna = 0;
  $scope.alfabeto = [
    [{v:'A', a:''}, {v:'B', a:''}, {v:'C', a:''}, {v:'D', a:''}, {v:'E', a:''}, {v:'F', a:''}, {v:'G', a:''}],
    [{v:'H', a:''}, {v:'I', a:''}, {v:'J', a:''}, {v:'K', a:''}, {v:'L', a:''}, {v:'M', a:''}, {v:'N', a:''}],
    [{v:'O', a:''}, {v:'P', a:''}, {v:'Q', a:''}, {v:'R', a:''}, {v:'S', a:''}, {v:'T', a:''}, {v:'U', a:''}],
    [{v:'V', a:''}, {v:'W', a:''}, {v:'X', a:''}, {v:'Y', a:''}, {v:'Z', a:''}, {v:'Ç', a:''}, {v:' ', a:'Espaço', c:'td-menor'}],
    [{v:'1', a:''}, {v:'2', a:''}, {v:'3', a:''}, {v:'4', a:''}, {v:'5', a:''}, {v:'6', a:''}, {v:'7', a:''}],
    [{v:'8', a:''}, {v:'9', a:''}, {v:'0', a:''}, {v:'.', a:''}, {v:',', a:''}, {v:'?', a:''}, {v:'!', a:''}],
    [{v:'enter', a:'Pular Linha', c:'td-menor'}, {v:'apagar', a:'', c:'td-menor'}, {v:'maiu', a:'Maiúscula', c:'td-menor'}, {v:'minu', a:'Minúscula', c:'td-menor'}, {v:'acento', a:'Acentuação', c:'td-menor'}, {v:'predicao', a:$scope.palavras[0].texto, c:'td-menor'}, {v:'predicao', a:$scope.palavras[1].texto, c:'td-menor'}]
  ];

  $scope.moment = "linha";

  window.scope = $scope;

  function pesquisar() {
    // Retira os sinais
    var split = $scope.frase_total.toLowerCase().replace(/[\'"<>!@#$%&*().,:;\/=?\[\]\\\+\|]+|[-+\s]/g, ' ').replace(/\s+/g, ' ').split(' ');
    var penultima_palavra = '@%';

    if (split.length > 1) penultima_palavra = split[split.length - 2];
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

    dbService.runAsync(query, function(data){
      $scope.palavras = data;
      if (!data.length)
      data.push("")
    });
  }

  $scope.zerar = function(atual) {
    if (atual == "maiu"){
      $scope.alfabeto = [
        [{v:'A', a:''}, {v:'B', a:''}, {v:'C', a:''}, {v:'D', a:''}, {v:'E', a:''}, {v:'F', a:''}, {v:'G', a:''}],
        [{v:'H', a:''}, {v:'I', a:''}, {v:'J', a:''}, {v:'K', a:''}, {v:'L', a:''}, {v:'M', a:''}, {v:'N', a:''}],
        [{v:'O', a:''}, {v:'P', a:''}, {v:'Q', a:''}, {v:'R', a:''}, {v:'S', a:''}, {v:'T', a:''}, {v:'U', a:''}],
        [{v:'V', a:''}, {v:'W', a:''}, {v:'X', a:''}, {v:'Y', a:''}, {v:'Z', a:''}, {v:'Ç', a:''}, {v:' ', a:'Espaço', c:'td-menor'}],
        [{v:'1', a:''}, {v:'2', a:''}, {v:'3', a:''}, {v:'4', a:''}, {v:'5', a:''}, {v:'6', a:''}, {v:'7', a:''}],
        [{v:'8', a:''}, {v:'9', a:''}, {v:'0', a:''}, {v:'.', a:''}, {v:',', a:''}, {v:'?', a:''}, {v:'!', a:''}],
        [{v:'enter', a:'Pular Linha', c:'td-menor'}, {v:'apagar', a:'', c:'td-menor'}, {v:'maiu', a:'Maiúscula', c:'td-menor'}, {v:'minu', a:'Minúscula', c:'td-menor'}, {v:'acento', a:'Acentuação', c:'td-menor'}, {v:'predicao', a:$scope.palavras[0].texto, c:'td-menor'}, {v:'predicao', a:$scope.palavras[1].texto, c:'td-menor'}]
      ];
    }
    else if (atual == "minu"){
      $scope.alfabeto = $scope.alfabeto = [
        [{v:'a', a:''}, {v:'b', a:''}, {v:'c', a:''}, {v:'d', a:''}, {v:'e', a:''}, {v:'f', a:''}, {v:'g', a:''}],
        [{v:'h', a:''}, {v:'i', a:''}, {v:'j', a:''}, {v:'k', a:''}, {v:'l', a:''}, {v:'m', a:''}, {v:'n', a:''}],
        [{v:'o', a:''}, {v:'p', a:''}, {v:'q', a:''}, {v:'r', a:''}, {v:'s', a:''}, {v:'t', a:''}, {v:'u', a:''}],
        [{v:'v', a:''}, {v:'w', a:''}, {v:'x', a:''}, {v:'y', a:''}, {v:'z', a:''}, {v:'ç', a:''}, {v:' ', a:'Espaço', c:'td-menor'}],
        [{v:'1', a:''}, {v:'2', a:''}, {v:'3', a:''}, {v:'4', a:''}, {v:'5', a:''}, {v:'6', a:''}, {v:'7', a:''}],
        [{v:'8', a:''}, {v:'9', a:''}, {v:'0', a:''}, {v:'.', a:''}, {v:',', a:''}, {v:'?', a:''}, {v:'!', a:''}],
        [{v:'enter', a:'Pular Linha', c:'td-menor'}, {v:'apagar', a:'', c:'td-menor'}, {v:'maiu', a:'Maiúscula', c:'td-menor'}, {v:'minu', a:'Minúscula', c:'td-menor'}, {v:'acento', a:'Acentuação', c:'td-menor'}, {v:'predicao', a:$scope.palavras[0].texto, c:'td-menor'}, {v:'predicao', a:$scope.palavras[1].texto, c:'td-menor'}]
      ];
    }
    else if (atual == "acento"){
      $scope.alfabeto = $scope.alfabeto = [
        [{v:'á', a:''}, {v:'à', a:''}, {v:'ã', a:''}, {v:'â', a:''}, {v:'À', a:''}, {v:'Á', a:''}, {v:'Ã', a:''}],
        [{v:'Ó', a:''}, {v:'ó', a:''}, {v:'õ', a:''}, {v:'Õ', a:''}, {v:'ô', a:''}, {v:'Õ', a:''}, {v:'Ê', a:''}],
        [{v:'ê', a:''}, {v:'', a:''}, {v:'', a:''}, {v:'', a:''}, {v:'', a:''}, {v:'', a:''}, {v:' ', a:'Espaço', c:'td-menor'}],
        [{v:'1', a:''}, {v:'2', a:''}, {v:'3', a:''}, {v:'4', a:''}, {v:'5', a:''}, {v:'6', a:''}, {v:'7', a:''}],
        [{v:'8', a:''}, {v:'9', a:''}, {v:'0', a:''}, {v:'.', a:''}, {v:',', a:''}, {v:'?', a:''}, {v:'!', a:''}],
        [{v:'enter', a:'Pular Linha', c:'td-menor'}, {v:'apagar', a:'', c:'td-menor'}, {v:'maiu', a:'Maiúscula', c:'td-menor'}, {v:'minu', a:'Minúscula', c:'td-menor'}, {v:'acento', a:'Acentuação', c:'td-menor'}, {v:'predicao', a:$scope.palavras[0].texto, c:'td-menor'}, {v:'predicao', a:$scope.palavras[1].texto, c:'td-menor'}]
      ];
    }
    else if (atual == "linha"){
      $scope.moment = "linha"
    }
  }

  $scope.voltar = function() {
    $scope.zerar("minu");
  };

  $scope.add_palavra = function(palavra) {
    new Audio("static/images/clique.mp3").play();

    var split = $scope.frase_total.split(' ');
    split[split.length - 1] = palavra;

    $scope.frase_total = split.join(" ");
    $scope.frase_total += " ";
    $scope.voltar();
  }

  function pula_linha() {
    if (++$scope.linha > 7) $scope.linha = 0;
  };

  $scope.escolhe_linha = function() {
    $scope.moment = "coluna";
  };

  $scope.escolhe_coluna = function() {
    $scope.moment = "";
  };


  function pula_coluna () {
    if ($scope.coluna++ > 7) $scope.coluna=0;
  };

  function iniciar_timer() {
    $scope.timer = setInterval(function(){
      if ($scope.moment=="linha") pula_linha()
      else pula_coluna()
      $scope.$apply();
    }, 2000);
  }

  iniciar_timer();

  receiver.on('blinks', (dados)=>{
    console.log(dados);
    if(dados.topic=='blink' && dados.tempo>0.4){
      $scope.adicionar_tecla();
    } else if (dados.topic=='close') {
      clearInterval($scope.timer);
    } else{
      iniciar_timer();
    }
  });

  $scope.adicionar_tecla = function(a) {
    new Audio("static/images/clique.mp3").play();
    console.log($scope.linha);
    console.log($scope.coluna);
    if ($scope.moment == "linha") {
      $scope.moment = "coluna";
    } else if ($scope.moment == "coluna") {
      var escolhida = $scope.alfabeto[$scope.linha][$scope.coluna].v
      if (escolhida == 'enter') {
        var tecla = "\n";

        $scope.frase_total += tecla;
        $scope.moment = "linha";

        if (tecla == ". " || tecla == ", "){
          salvar();
          $scope.zerar("maiu");
        }
      } else if (escolhida == 'apagar') {
        $scope.backspace();
      }
      else if (escolhida == 'maiu' || escolhida == 'minu' || escolhida == 'acento'){
        $scope.zerar(escolhida);
      }
      else if (escolhida == 'predicao'){
        $scope.add_palavra($scope.alfabeto[$scope.linha][$scope.coluna].a);
        
      } else {
        var tecla = $scope.alfabeto[$scope.linha][$scope.coluna].v;
        $scope.frase_total += tecla;

        $scope.voltar();

        if (tecla == ". " || tecla == ", "){
          salvar();
          $scope.zerar("maiu");
        }
      }

      $scope.moment = "linha";
    }

    $scope.salvar_txt();
  }

  $scope.backspace = function() {
    new Audio("static/images/clique.mp3").play();
    $scope.frase_total = $scope.frase_total.substring(0,$scope.frase_total.length - 1);
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

  $scope.salvar_txt = function() {
    fs.readFile('texto.txt', function read(err, dados) {
      if (err) throw err;
      dados = $scope.frase_total;
      fs.writeFile('texto.txt', dados, function (err) {
      });
    });

    $("textarea").scrollTop($("textarea")[0].scrollHeight);

    pesquisar();
  }

  $scope.$watch('coluna', (antigo, novo) => {
    $(`td[linha=${$scope.linha}]`).css("background-color", "#baa17e");
    $("th[data-id='coluna']").removeClass("ativo");
    $(`th[coluna=${$scope.coluna}]`).addClass("ativo");
    $(`td[linha=${$scope.linha}][coluna=${$scope.coluna}]`).css("background-color", "#ddc6a6");
  });

  $scope.$watch('linha', (antigo, novo) => {
    $("td").css("background-color", "#EFEFEF");
    $("th[scope='row']").removeClass("ativo");
    $(`th[linha=${$scope.linha}]`).addClass("ativo");
    $(`td[linha=${$scope.linha}]`).css("background-color", "#baa17e");
    $(`td[linha=${$scope.linha}][coluna=${$scope.coluna}]`).css("background-color", "#e8d1b2");
  });

});
