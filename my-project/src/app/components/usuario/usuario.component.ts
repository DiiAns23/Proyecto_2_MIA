import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInterface } from 'src/app/models/user-interface';
import { HomeService } from 'src/app/services/home.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2/src/sweetalert2.js';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  constructor(private crudService:UserService,
     private homeService:HomeService,
     private router:Router
     ) { }

  uploadedFiles:Array<File> = [];
  Informacion = this.crudService.GetCurrentUser();
  id = -1;
  name = "";
  username = "";
  password = "";
  pass = "";
  img = "";
  image = false;
  
  ngOnInit(): void {
    if(this.Informacion['image']!= null){
      this.image=true;
    }
    this.id = this.Informacion['iduser'];
    this.name = this.Informacion['name'];
    this.username = this.Informacion['username'];
    this.img = this.Informacion['image'];
    this.password = this.Informacion['password'];
  }

  abrir(e:any)
  {
    this.uploadedFiles = e.target.files;
    this.img = 'assets/public/' + this.uploadedFiles[0].name
  }

  Update(){
    if(this.name!="" && this.username!="" && this.pass!="")
    {
        this.crudService.UpdateUser(this.name,this.username,this.img,this.pass, this.Informacion['username']).subscribe((res)=>{
            if(res['name']!="null"){
              let data:UserInterface = {
                "iduser": this.id,
                "name": res['name'],
                "username": res['username'],
                "image": res['image'],
                "password": this.password
                }
              this.homeService.LogOut1();
              this.crudService.SetCurrentUser(data)
              Swal.fire({
                title: 'Succes',
                text: "Datos Actualizados Correctamente",
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok'
                }).then((result) => {
                  if (result.isConfirmed) {
                    if(this.uploadedFiles!=[]){
                      this.onUpload();
                    }             
                    this.router.navigate(["/home"]);
                  }
                })
            }else{
              Swal.fire({
                title: 'Error',
                text: "Contraseña incorrecta :c",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok'
                }).then((result) => {         
                  this.router.navigate(["/home/usuario"]);
                })              
            }

          });
          
    }else{
      Swal.fire({
        title: 'Error',
        text: "Por favor llena todos los campos",
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok'
        }).then((result) => {         
          this.router.navigate(["/home/usuario"]);
        })
    }
  }

  onUpload(){
    let formData = new FormData();
    if(this.uploadedFiles!=null){
      for(let i=0; i<this.uploadedFiles.length; i++){
        formData.append("uploads[]",this.uploadedFiles[i], this.uploadedFiles[i].name);
      }
      // Llamar al Service
      this.crudService.uploadFile(formData).subscribe((res)=>{
        console.log('Response: ', res.ruta );
      })
    }
  }

}
