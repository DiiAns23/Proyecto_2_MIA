import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInterface } from 'src/app/models/user-interface';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2/src/sweetalert2.js'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public Service: UserService, private router:Router,) { }

  ngOnInit(): void {
    this.Service.GetUsers().subscribe((res:UserInterface[]) =>{
      this.Usuarios = res;
      for(var i in this.Usuarios){
        console.log(this.Usuarios[i].username, this.Usuarios[i].password)
      }
    })
  }
  username: string = "";
  password: string = "";
  Usuarios: UserInterface[] = [];

  Login(){
    var exist=false;
    for(var a=0; a<this.Usuarios.length; a++){
      if(this.Usuarios[a].username == this.username && 
        this.Usuarios[a].password == this.password){
        exist = true;
        console.log("Si existe :3")
      }
    }
    if(exist){
      this.Service.LogIng(this.username, this.password).subscribe((res) =>{
        console.log(res);
        console.log(res['msg']);
        console.log(res['DataUser']);
        if(res['msg']){
          let data_user: UserInterface = res['DataUser'];
          this.Service.SetCurrentUser(data_user)
          this.router.navigate(['home'])
        }
      })
    }
    else{
      Swal.fire({
        title: 'Error',
        text: "Usuario o Contraseña Incorrectos",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      })
    }
  }

}
