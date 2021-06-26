import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Publications, UserInterface } from 'src/app/models/user-interface';
import { HomeService } from 'src/app/services/home.service';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2/src/sweetalert2.js'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private homeService:HomeService,private crudService: UserService,
    public modal:NgbModal, private router:Router) { }

  Publications:Publications[] = [];
  Usuarios:UserInterface[]=[];
  uploadedFiles:Array<File> = [];
  text = "";
  iduser = this.crudService.GetCurrentUser()['iduser'];
  name = this.crudService.GetCurrentUser()['name']
  image = '';
  tags = "";
  idfriend = -1;

  ngOnInit(): void {
    Swal.fire({
        title: 'Bienvenido '+this.name,
        text: "",
        icon: 'success',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar'
      })
    this.homeService.GetPublications().subscribe((res:Publications[]) =>{
      this.Publications = res;
      for(var i in this.Publications){
        console.log(this.Publications[i].id)
      }
    })

    this.crudService.GetUsers().subscribe((res:UserInterface[]) =>{
      this.Usuarios = res;
      for(var i=0;i<this.Usuarios.length;i++){
        if(this.Usuarios[i].id==this.iduser){
          this.Usuarios.splice(i,1)
        }
      }
    })
  }

  LogOut(){
    Swal.fire({
      title: 'Log Out',
      text: "Cerrar Sesion?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Log Out!',
          'Success'
          )
          this.homeService.LogOut();
      }
    })
  }

  abrir(e:any)
  {
    this.uploadedFiles = e.target.files;
    this.image = 'assets/public/' + this.uploadedFiles[0].name
    console.log(this.image+" Aqui abrimos");
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

  NewPost(){
    if(this.image!=""){
      this.onUpload();
      this.crudService.NewPost(this.text,this.iduser,this.image).subscribe((res:Publications[])=>{
        this.Publications = res;
        this.image = "",
        this.text = ""
      })
    }else{
      Swal.fire({
        title: 'Error',
        text: "No has seleccionado ninguna imagen",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      })
    }
  }

  AddFriend(){
    console.log("Estamos en el metodo AddFriend() con el idFriend de:", this.idfriend)
    if(this.idfriend!=-1){
      for(var i=0;i<this.Usuarios.length;i++){
        if(this.Usuarios[i].id==this.idfriend){
          this.Usuarios.splice(i,1)
        }
      }
    }else{
      Swal.fire({
        title: 'Error',
        text: "No has seleccionado un nuevo amigo",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      })
    }
  }
  
}