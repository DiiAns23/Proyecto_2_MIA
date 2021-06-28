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
    console.log(this.name, this.username, this.image);
  }

  abrir(e:any)
  {
    this.uploadedFiles = e.target.files;
    this.img = 'assets/public/' + this.uploadedFiles[0].name
    console.log(this.img)
  }

  Update(){
    if(this.name!="" && this.username!="" && this.pass!="")
    {
      console.log("Nombre:", this.name, " Username: ", this.username, " Imagen:", this.img)
      this.crudService.UpdateUser(this.name,this.username,this.img,this.password, this.Informacion['username']).subscribe((res)=>{
          let data:UserInterface = {
            "iduser": this.id,
            "name": res['name'],
            "username": res['username'],
            "image": res['image'],
            "password": this.password
            }
          this.homeService.LogOut1();
          this.crudService.SetCurrentUser(data)

        });
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
