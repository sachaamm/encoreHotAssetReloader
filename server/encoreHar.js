const folder = "../assets";

const path = require('path');

var fs = require('fs');


const directoryPath = path.join(__dirname, folder);

const eharf = require("./modules/eharFolder")
const eharfe = require("./modules/eharFolderExplorator")
const eharr = require("./modules/eharRepertoire")

let transpiledEntries = [
    { entry:"/assets/js/app.js" , transpiled:"/app.js" },
    { entry:"/assets/css/app.css" , transpiled:"/app.css" }
];



eharr.buildRepertoire(transpiledEntries,function(){

   eharfe.readFilesRecursivelyInFolder(directoryPath, null)

})



var http = require('http');
var io = require('socket.io').listen(8081);


// Chargement du fichier index.html affiché au client
var server = http.createServer(function (req, res) {
    fs.readFile('./index.html', 'utf-8', function (error, content) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
    });
});

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Client is connected !');

    eharfe.defineWS(io.sockets)

    socket.emit('message', { message : "hello"});

    socket.on('message', function (message) {
      
        if(message == "ask_assets_to_reload"){
            eharfe.sendWS(socket)
        }

        

    });



    socket.on('release_reloaded',function(message){
        eharfe.releaseReloaded(message)
    });

});


//server.listen(8081);


