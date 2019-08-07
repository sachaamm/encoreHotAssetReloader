exports.FolderExplorator = class FolderExplorator {

    constructor(path, options) {

    }

}

const fs = require('fs');
const eharf = require("./eharFolder")
const eharfi = require("./eharFile")
const eharr = require("./eharRepertoire")

let folderFiles = [];
let folders = [];
let filesToReload = [];

let debugFileReading = true;
let checkingLoop = 500;

let websocketObject = null;

exports.readFilesRecursivelyInFolder = function readFilesRecursivelyInFolder(directoryPath, parentPath) {

    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        let c = 0;
        let childrens = 0;

        //listing all files using forEach
        files.forEach(function (file) {

            let folderPath = directoryPath + "/" + file

            fs.lstat(folderPath, (err, stat) => {

                if (stat.isFile()) {

                    let a = folderPath.lastIndexOf("/assets/");

                    let entry = folderPath.substring(a,folderPath.length);
                    console.log(entry);
                    //console.log("eee");

                    eharr.getRepertoire(function(rr){
                        console.log(rr)
                    })

                    eharr.getTranspiledFromEntry(entry, function(transpiled){
                        folderFiles.push(new eharfi.File(folderPath, entry, transpiled,createdDate(folderPath)))
                        console.log("azaeaze");
                    });

                    

                    


                } else {
                    childrens++;
                    readFilesRecursivelyInFolder(folderPath, directoryPath)
                }

                c++;

                if (c == files.length) {

                    let explored = false;
                    if (childrens == 0) explored = true

                    //console.log(directoryPath);


                    folders.push(new eharf.Folder(directoryPath, explored, childrens, parentPath));
                    //console.log(folders)

                    getFolderByPath(directoryPath, folders, function (folder) { // GET FOLDER

                        getFolderByPath(parentPath, folders, function (parentFolder) { // GET PARENT FOLDER

                            if (parentFolder) {
                                parentFolder.concludeExploration(parentFolder, folder);

                                checkIfAllFoldersAreExplored(folders, function () {

                                    if (debugFileReading) console.log(folderFiles);
                                    setTimeout(checkFilesCreationDate, checkingLoop);

                                    console.log("over");
                                });
                            }
                        });

                    })

                }

            });




        });

        //console.log(folders);


    });

}

function checkFilesCreationDate() {
    //console.log("checkFilesCreationDate");

    folderFiles.forEach(function (file) {

        let timeA = parseInt(file.creationDate.getTime())
        let timeB = parseInt(createdDate(file.path).getTime())

        if (parseInt(file.creationDate.getTime()) != parseInt(createdDate(file.path).getTime())) {
            console.log("file " + file.path + " has changed ")
            if(!filesToReload.includes(file.transpiled))filesToReload.push(file.transpiled)
            //filesToReload.push(file.path)
            file.creationDate = createdDate(file.path)
            
                //console.log(websocketObject);
        }
       

    })


    setTimeout(checkFilesCreationDate, checkingLoop);
}

function removeAssetFromFilesToReload(path){

    let i = 0;
    filesToReload.forEach(function (file){
        if(file == path) filesToReload.splice(i);
        i++;
    });
}


function getCreationDateOfFiles(files) {
    files.forEach(function (file) {
        console.log(
            createdDate(file.path)
        )


    })
}


function checkIfAllFoldersAreExplored(folders, cb) {
    let i = 0;
    folders.forEach(function (folder) {
        if (folder.explored) i++;
        if (i == folders.length) cb();
    });

}


function getFolderByPath(path, folders, cb) {

    let i = 0;
    folders.forEach(function (folder) {
        if (path == folder.path) cb(folder);
        //i++;
        //if (i == folders.length) cb(null);

    });
}

function getFileByTranspiled(transpiled, cb){
    folderFiles.forEach(function (folderFile) {
        if(folderFile.transpiled == transpiled) cb(folderFile)
    });
}

function createdDate(file) {
    const { birthtime } = fs.statSync(file)

    return birthtime
}

exports.defineWS = function defineWS(ws){
    websocketObject = ws;
}

exports.sendWS = function sendWS(socket){
    
    socket.emit('message', {message: "reload", content: filesToReload} );

}

exports.releaseReloaded = function releaseReloaded(message){
    message.forEach(function (fileReloaded){
        
        getFileByTranspiled(fileReloaded, function (fileReload){
            let i = 0

            filesToReload.forEach(function (file){
    
                if(file == fileReload.transpiled){    
                    filesToReload.splice(i);
                }
    
                i++
            })

        })

        
    })
}