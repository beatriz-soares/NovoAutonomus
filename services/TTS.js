var request = require('request'),
    xmlbuilder = require('xmlbuilder'),
    wav = require('wav'),
    fs = require('fs');


exports.Sintetizador = function Sintetizador(texto, titulo){
  var apiKey = "19f7ac156a9240118097753f3e076eaa";
    var ssml_doc = xmlbuilder.create('speak')
        .att('version', '1.0')
        .att('xml:lang', 'pt-BR')
        .ele('voice')
        .att('xml:lang', 'pt-BR')
        .att('xml:gender', 'Male')
        .att('name', 'Microsoft Server Speech Text to Speech Voice (pt-BR, Daniel, Apollo)')
        .txt(texto)
        .end();
    var post_speak_data = ssml_doc.toString();

    request.post({
    	url: 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken',
        headers: {
            'Ocp-Apim-Subscription-Key' : apiKey
        }
    }, function (err, resp, access_token) {
        if (err || resp.statusCode != 200) {
            console.log(err, resp.body);
        } else {
            try {
                request.post({
                    url: 'https://speech.platform.bing.com/synthesize',
                    body: post_speak_data,
                    headers: {
                        'content-type' : 'application/ssml+xml',
                        'X-Microsoft-OutputFormat' : 'riff-16khz-16bit-mono-pcm',
                        'Authorization': 'Bearer ' + access_token,
                        'X-Search-AppId': '07D3234E49CE426DAA29772419F436CA',
                        'X-Search-ClientID': '1ECFAE91408841A480F00935DC390960',
                        'User-Agent': 'TTSNodeJS'
                    },
                    encoding: null
                }, function (err, resp, speak_data) {
                    if (err || resp.statusCode != 200) {
                        console.log(err, resp.body);
                    } else {
                      fs.writeFile(titulo+'.wav', speak_data, function(err) {
                        new Audio(titulo+'.wav').play();
                      });
                    }
                });
            } catch (e) {
                console.log(e.message);
            }
        }
    });
}
