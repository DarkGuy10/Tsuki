const { app, BrowserWindow } = require('electron');

var mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        resizable: true,
        backgroundColor: '#1e1e1e',
        webPreferences: {
//            devTools: false, //disabled for testing
            nodeIntegration: true
        }
    });
    mainWindow.maximize();
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    mainWindow.setMenu(null);
//    mainWindow.openDevTools(); //for testing
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if(process.platform != 'darwin'){
        app.quit();
    }
});
