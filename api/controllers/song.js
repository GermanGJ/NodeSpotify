'use strict'

var path = require('path');
var fs = require('fs');
var moongoosePagination = require('mongoose-Pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){

    console.log('Entra getSong');

    var songId = req.params.id;

    console.log('id: ' + songId);

    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!song){
                res.status(404).send({message: 'La cancion no existe'});
            }else{
                res.status(200).send({song})
            }
        }
    });
}


function getSongs(req, res){
    var albumId = req.params.album;

    console.log(albumId);

    if(!albumId){
        var find = Song.find({}).sort('number');
    }else{
        var find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec(function(err, songs){
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!songs){
                res.status(404).send({message: 'No hay canciones'});
            }else{  
                res.status(200).send({songs});
            }
        }
    });
}

function saveSong(req, res){
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!songStored){
                res.status(404).send({message: 'No se ha guardado la cancion'});
            }else{
                res.status(200).send({song: songStored});
            }
        }
    });
}


function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdate) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!songUpdate){
                res.status(404).send({message: 'No se ha actualizado la cancion'});
            }else{
                res.status(200).send({song: songUpdate});        
            }
        }
    });
}


function deleteSong(req, res){
    var songId = req.params.id;

    Song.findByIdAndDelete(songId, (err, songRemove) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!songRemove){
                res.status(404).send({message: 'No se ha borrado la cancion'});
            }else{
                res.status(200).send({song: songRemove});
            }
        }
    });
}


function uploadFile(req, res){
    var songId = req.params.id;
    var file_name = 'No subido...';

    if(req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        console.log(file_split);
        console.log(file_ext);

        if (file_ext == 'mp3' || file_ext == 'ogg'){
            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdate) => { 
                if(err){
                    res.status(500).send({message: 'Error al actualizar el usuario.'});
                }else{
                    if(!songUpdate){
                        res.status(404).send({message: 'No se ha podido actualizar el usuario.'});
                    }else{
                        res.status(200).send({song: songUpdate});
                    }
                }
            });
        }
    }else{
        res.status(200).send({message: 'No has subido ninguna imagen...'});
    }
}


function getSongFile(req, res){
    var imageFile = req.params.songFile;
    var path_file = './uploads/songs/' + imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));    
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
};