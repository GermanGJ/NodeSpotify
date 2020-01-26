'use strict'

var path = require('path');
var fs = require('fs');
var moongoosePagination = require('mongoose-Pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!artist){
                res.status(404).send({message: 'El artista no existe'});
            }else{
                res.status(200).send({artist});
            }
        }
    });
}


function getArtists(req, res){

    console.log("InPages: " + req.params.page);

    if(req.params.page){
        var page = req = req.params.page;
    }else{
        var page = 1;
    }
    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!artists){
                res.status(404).send({message: 'No hay artistas'});
            }else{
                return res.status(200).send({
                    pages: total,
                    artists: artists
                });
            }
        }
    });
}



function saveArtist(req, res){
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el artista'});
        }else{
            if(!artistStored){
                res.status(404).send({artist: artistStored});
            }else{
                res.status(200).send({artist: artistStored});
            }
        }
    });
}


function updateArtist(req, res){

    console.log("Metodo Update (Artist)");
    console.log("id: " + req.params.id);
    
    var artistId = req.params.id;
    var update = req.body;

    console.log("A1");

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdate) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el artista'});
        }else{
            if(!artistUpdate){
                res.status(404).send({message: 'Error el artista no se actualizo'});
            }else{
                res.status(200).send({artist: artistUpdate});
            }
        }
    });
}


function deleteArtist(req, res){
    var artistId = req.params.id;
    console.log("Id: " + artistId);

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if(err){
            res.status(500).send({message: 'Error al borrar el artista'});
        }else{
            if(!artistRemoved){
                res.status(404).send({message: 'El artista no ha sido eliminado'});
            }else{
                Album.find({artist: artistRemoved._id}).remove((err, albumRemove) => {
                    if(err){
                        res.status(500).send({message: 'Error al eliminar el album'});
                    }else{
                        if(!albumRemove){
                            res.status(404).send({message: 'El album no ha sido borrado'});
                        }
                        else{
                            Song.find({album: albumRemove._id}).remove((err, songRemove) => {
                                if(err){
                                    res.status(500).send({message: 'Error al eliminar la cancion'});
                                }else{
                                    if(!songRemove){
                                        res.status(404).send({message: 'La cancion no ha sido eliminada'});
                                    }
                                    else{
                                        res.status(200).send({artistRemoved});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    })
}


module.exports = {
    getArtist,
    getArtists,
    saveArtist,
    updateArtist,
    deleteArtist
};