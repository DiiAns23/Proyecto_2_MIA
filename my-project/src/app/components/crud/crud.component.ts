import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { UserInterface } from "../../models/user-interface";
import { Router } from '@angular/router';
import Swal from'sweetalert2';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  uploadedFiles:Array<File> = [];
  iduser: number = -100;
  name: string = "";
  username: string = "";
  password: string = "";
  confirm_password: string = "";
  image = "";
  Usuarios: UserInterface[] = [];

  constructor(private crudService:UserService, private _router:Router) { }

  ngOnInit(): void {

    this.crudService.GetUsers().subscribe((res:UserInterface[]) =>{
      this.Usuarios = res;
      for(var i in this.Usuarios){
        console.log(this.Usuarios[i].name)
      }
    })
  }
  
  addUser(){
    for(var a=0; a<this.Usuarios.length; a++){
      if(this.Usuarios[a].username== this.username){
        Swal.fire({
          title: 'Error',
          text: "Nombre de Usuario ya Exisente",
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar'
        })
        return;
      }
    }
    if(this.name!=""){
      if((this.password == this.confirm_password) && (this.password!="") && (this.confirm_password!=""))
      {
        this.crudService.InsertUser(this.name, this.username, this.password, this.image)
        .subscribe((res:UserInterface[]) =>{
          this.Usuarios = res,
          this.name = "",
          this.username = "",
          this.password = "",
          this.confirm_password = "",
          this.image = "";
        })
        Swal.fire({
          title: 'Succes',
          text: "Usuario creado correctamente",
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            if(this.uploadedFiles!=[]){
              this.onUpload();
            }             
            this._router.navigate(["/login"]);
          }
        })
      }
      else{
        Swal.fire({
          title: 'Error',
          text: "Las contraseñas no coinciden",
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar'
        })
      }
    }else{
      Swal.fire({
        title: 'Error',
        text: "Las por favor ingrese todos los campos",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      })
    }
    
  }
  getDataUser(iduser:number, name:string, username:string, password:string){
    this.iduser = iduser;
    this.name = name;
    this.username = username;
    this.password = password;
  }

  abrir(e:any)
  {
    this.uploadedFiles = e.target.files;
    this.image = 'assets/public/' + this.uploadedFiles[0].name
  }
  onUpload(){
    let formData = new FormData();
    for(let i=0; i<this.uploadedFiles.length; i++){
      formData.append("uploads[]",this.uploadedFiles[i], this.uploadedFiles[i].name);
    }
    // Llamar al Service
    this.crudService.uploadFile(formData).subscribe((res)=>{
      console.log('Response: ', res.ruta );
      this.image = res.ruta;
    })
  }
}
