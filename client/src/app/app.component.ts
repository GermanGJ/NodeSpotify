import { Component, OnInit } from '@angular/core';
import { UserService } from './servicies/user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
  //styleUrls: ['./app.component.css']
})

export class AppComponent {
  public title = 'NodeSpotify!';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMenssage;
  public alertRegister;



  constructor(
    private _userService:UserService
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);

  }

  public onSubmit(){
    console.log(this.user);

    //Conseguir los datos del usuario identificado.
    this._userService.signup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;

        if(!this.identity._id){
          alert("El usuario no está correctamente identificado.")
        }else{
          // Crear elemento en el localstore para tener al usuario en sesion.
          localStorage.setItem('identity', JSON.stringify(identity));

          // Conseguir el token para enviarlo a cada peticion.
          this._userService.signup(this.user, true).subscribe(
            response => {
              let token = response.token;
              this.token = token;
      
              if(this.token.length <= 0){
                alert("El token no se ha generado correctamente.")
              }else{
                // Crear elemento en el localstore para tener al usuario en sesion.
                localStorage.setItem('token', token);
              }
            },
            error => {
              var errorMensaje = <any>error;
              if(errorMensaje != null){
                var body = JSON.parse(error._body);
                this.errorMenssage = body.message;
              }
            }
          );
        }
      },
      error => {
        var errorMensaje = <any>error;
        if(errorMensaje != null){
          var body = JSON.parse(error._body);
          this.errorMenssage = body.message;
        }
      }
    );
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this.user.email = null;
    this.user.password = null;
    this.alertRegister = null;
  }

  
  onSubmitRegister(){
    console.log(this.user_register);

    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;

        if(!user._id){
          alert('Error al registrarse');
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'El registro se ha realizado correctamente, identificate con ' + this.user_register.email + '.';
          this.user_register =   this.user_register = new User('','','','','','ROLE_USER','');
        }
      },
      error => {
        var errorMensaje = <any>error;
        if(errorMensaje != null){
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);
        }
      }
    );
  }

}
