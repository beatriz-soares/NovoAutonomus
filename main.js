"USE STRICT"

var electron = require('electron');
var app = require('app');
var BrowserWindow = require('browser-window');
var exec = require('child_process').exec;

require('electron-debug')({showDevTools: false});

var mouseControl = exec('python3 ' + __dirname + '/pupil_remote/mouse_control.py');

// referência global para manter a instância da janela até que sejam fechadas pelo usuário então ele irá ser fechado quando o JavaScript fizer Garbage collection
var mainWindow = null;

// Sair da aplicação quando todas as janelas forem fechadas
app.on('window-all-closed', function() {
  mouseControl.kill();

  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  // Cria a janela do browser.
  mainWindow = new BrowserWindow({width: 1400, height: 800});

  // Adiciona o Jquery ao projeto
  // let $ = require('jQuery');
  // mainWindow.$ = $;

  // Carrega o arquivo html principal.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // aber o DevTools. (console, inspecionar elemento, etc)
  // mainWindow.webContents.openDevTools();

  // Evento emitido quando a janela é fechada, usado para destruir instancia.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

app.on('will-quit', function() {
  mouseControl.kill();
});

app.on('quit', function() {
  mouseControl.kill();
});
