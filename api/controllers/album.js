'use strict'

var path = require('path');
var fs = require('fs');
var moongoosePagination = require('mongoose-Pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getAlbum(req, res){
    var albumId = req.params.id;
    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) =>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!album){
                res.status(404).send({message: 'El album no existe'});
            }else{
                res.status(200).send({album});
            }
        }
    });
}


function getAlbums(req, res){

    var artistId = req.params.artist;

    if (!artistId){
        var find = Album.find({}).sort('title');
    }else{
        var find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!albums){
                res.status(404).send({message: 'No hay albums'});
            }else{
                return res.status(200).send({
                    album: albums
                });
            }
        }
    });
}


function saveAlbum(req, res){
    var album = new Album();
    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;


    album.save((err, albumStored) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el album'});
        }else{
            if(!albumStored){
                res.status(404).send({message: 'No se ha guardado el album'});
            }else{
                res.status(200).send({album: albumStored});
            }
        }
    });
}


function updateAlbum(req, res){

    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdate) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el album'});
        }else{
            if(!albumUpdate){
                res.status(404).send({message: 'Error el album no se actualizo'});
            }else{
                res.status(200).send({artist: albumUpdate});
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


function deleteAlbum(req, res){
    var albumId = req.params.id;
    
    //Album.findByIdAndRemove(artistId, (err, artistRemoved) => {

    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if(err){
            res.status(500).send({message: 'Error al borrar el album'});
        }else{
            if(!albumRemoved){
                res.status(404).send({message: 'El album no ha sido eliminado'});
            }else{
                Song.find({album: albumRemoved._id}).remove((err, albumRemove) => {
                    if(err){
                        res.status(500).send({message: 'Error al eliminar las canciones'});
                    }else{
                        res.status(200).send({albumRemove});
                    }
                });
            }
        }
    })
}



function uploadImage(req, res){
    var albumId = req.params.id;
    var file_name = 'No subido---';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => { 
                if(err){
                    res.status(500).send({message: 'Error al actualizar el album.'});
                }else{
                    if(!albumUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar el album.'});
                    }else{
                        res.status(200).send({user: albumUpdated});
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
    var path_file = './uploads/albums/' + imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));    
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}


module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};