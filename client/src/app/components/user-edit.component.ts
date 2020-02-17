import { Component, OnInit } from '@angular/core';

import { GLOBAL } from '../servicies/global';
import { UserService } from '../servicies/user.service';
import { User } from '../models/user';
import { ComponentStillLoadingError } from '@angular/compiler/src/private_import_core';


@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
  })

export class UserEditComponent implements OnInit{
    public titulo: string;
    public user: User;
    public identity;
    public token;
    public alertMessager;
    public url:string;
    public filesToUpload: Array<File>;

    constructor(
        private _userService:UserService
    ){
        this.titulo = 'Actualizar mis datos';
        this.user = new User('','','','','','ROLE_USER','');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('user-edit.component.ts cargado');
    }

    onSubmit(){
        console.log(this.user);
        this._userService.update_User(this.user).subscribe(
            Response => {
                //this.user = Response.user;
                if(!Response.user){
                    this.alertMessager = 'Usuario no actualizado';
                }else{
                    //this.user = Response.user;
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    document.getElementById("identity_name").innerHTML = this.user.name;

                    console.log(this.filesToUpload);

                    if(!this.filesToUpload){
                        // Redireccion.
                        console.log('Redireccion');
                    }else{
                        console.log('NOOO Redireccion');
                        this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload).then(
                            (result: any) => {
                                console.log('Ruta img: ' + result.image);
                                this.user.image = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));
                                
                                console.log('Pasa A12334e');
                                console.log(this.user);
                            }
                        );
                    }
                    
                    this.alertMessager = 'Usuario actualizado correctamente';
                    console.log('Usuario Actualizado');
                }
            },
            error => {
                var errorMensaje = <any>error;

                if(errorMensaje != null){
                    var body = JSON.parse(error._body);
                    this.alertMessager = body.message;
                }
            }
        );
    }

    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>){
        var token = this.token;

        return new Promise(function(resolve, reject){
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();

            for(var i = 0; i < files.length; i++){
                formData.append('image',files[i], files[i].name);
            }

            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response);
                    }
                }
            }

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}