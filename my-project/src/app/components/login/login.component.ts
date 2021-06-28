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
  }
  username: string = "";
  password: string = "";
  Usuarios: UserInterface[] = [];

  Login(){
      this.Service.LogIng(this.username, this.password).subscribe((res) =>{
        console.log(res['DataUser']);
        if(res['msg']){
          let data_user: UserInterface = res['DataUser'];
          this.Service.SetCurrentUser(data_user)
          Swal.fire({
            title: 'Bienvenido '+res['DataUser']['name'],
            text: "",
            icon: 'success',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
          })
          this.router.navigate(['home'])
        }else{
          Swal.fire({
            title: 'Error',
            text: "Usuario o Contraseña Incorrectos",
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          })
        }
      })
  }

}
