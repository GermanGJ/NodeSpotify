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



function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'No subido...';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        console.log(file_split);
        console.log(file_ext);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => { 
                if(err){
                    res.status(500).send({message: 'Error al actualizar el usuario.'});
                }else{
                    if(!userUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar el usuario.'});
                    }else{
                        res.status(200).send({user: userUpdated});
                    }
                }
            });
        }
    }else{
        res.status(200).send({message: 'No has subido ninguna imagen...'});
    }
}


function uploadImage(req, res){
    var artistId = req.params.id;
    var file_name = 'No subido---';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        console.log(file_split);
        console.log(file_ext);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => { 
                if(err){
                    res.status(500).send({message: 'Error al actualizar el artista.'});
                }else{
                    if(!artistUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar el artista.'});
                    }else{
                        res.status(200).send({user: artistUpdated});
                    }
                }
            });
        }
    }else{
        res.status(200).send({message: 'No has subido ninguna imagen...'});
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/artists/' + imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));    
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}



module.exports = {
    getArtist,
    getArtists,
    saveArtist,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};