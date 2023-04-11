const electron = require('electron')
const fs = require('fs')

const {app, BrowserWindow, ipcMain, dialog} = electron
let win
let filePath = undefined

// when the application is ready, it creates the window and loads the index.html file to display the information
app.on('ready', ()=>{
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 1920,
        height: 1080
    })
    win.loadFile('index.html')
} )

// when the save event is called and the file path is undefined 
//it makes it possible to create a new file, or write to the file if it is already defined
ipcMain.on('save', (event, text)=>{
    if(filePath===undefined){
        dialog.showSaveDialog(win, {defaultPath: 'filename.txt'}, (fullPath)=>{
            if(fullPath){
                filePath = fullPath
                writeToFile(text)
            }
        })
    }else{
        writeToFile(text)
    }
})

//function to write to a txt file
function writeToFile(data){
    fs.writeFile(filePath, data, (err)=>{
        if(err)console.log('there was an error. sorry!', err)
        console.log('file has been saved')
        win.webContents.send('saved', 'success')
    })
}