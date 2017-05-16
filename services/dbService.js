"USE STRICT";
app.factory("dbService", function($http){
	var sqlite = require('sqlite-sync');
	var db = sqlite.connect('model/autonomus.db');
	return db;
});

// app.provider("banco", function(dbService){
// 	this.$get = [
// 		function inserir_texto(titulo, texto, callback) {
// 			var query = `INSERT INTO texto (texto, data, titulo) VALUES (${texto}, ${new Date().toISOString()}, ${titulo})`;
//
//       dbService.runAsync(query, function(data){
//         callback(data);
//       });
//   	}
// 	];
// });
