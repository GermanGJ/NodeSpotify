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

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong
};