let repertoire = [];

exports.buildRepertoire = function(r,cb){
    repertoire = r;
    cb();
}

exports.repertoire = repertoire

exports.getRepertoire = function(cb){
    cb(repertoire)
}

exports.getTranspiledFromEntry = function getTranspiledFromEntry(entry,cb){
    console.log("re");
    console.log(entry)
    
    repertoire.forEach(function(repertoireEntry){

        console.log(repertoireEntry);

        if(repertoireEntry.entry == entry)cb(repertoireEntry.transpiled)
    })
}