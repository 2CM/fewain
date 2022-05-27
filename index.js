/*
const fs = require("fs");

var settings = JSON.parse(fs.readFileSync("settings.json")); //(its in the .gitignore)

var currentDir = settings.start;

*/


//electron stuff

const {app, BrowserWindow} = require("electron");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        show: false,
    });

    win.loadFile("window/index.html");

    win.once("ready-to-show", function() {
        win.show();
    });
}

app.once("ready", () => { //when app is ready, open a window
    createWindow();
});

app.on("window-all-closed", () => { //quit app if all windows are closed
    if(process.platform != "darwin") app.quit();
});