import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Friends, Publications, UserInterface, GetSetFR } from 'src/app/models/user-interface';
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
  Filter: Publications[] = [];
  Auxiliar: Publications[] = [];
  Usuarios:Friends[]=[];
  Friend_Request:Friends[]=[];
  GetSetFR: GetSetFR[] = [];
  Amigos: Friends[] = [];
  uploadedFiles:Array<File> = [];
  text:string = "";
  iduser = this.crudService.GetCurrentUser()['iduser'];
  name = this.crudService.GetCurrentUser()['name'];
  imageUser = this.crudService.GetCurrentUser()['image'];
  image:string = '';
  tags:string = "";
  tag:string = "";
  idTotalFriends: string = "";
  idfriend:number = -1;
  idfriend2: number= -1;
  SeeButtonFriend = false;
  SeeButtonFriend2 = false;
  SeeButtonFriend3 = false;
  SeeTextTag = false;

  ngOnInit(): void {
    var ids="";
    this.homeService.GetFriends(this.iduser).subscribe((res:Friends[]) =>{
      this.Amigos = res;
      for(var i = 0; i<this.Amigos.length;i++){
        ids += this.Amigos[i].id +",";
        this.SeeButtonFriend2 = true;
      }
      ids += this.iduser
      this.homeService.GetPublications(ids).subscribe((res:Publications[]) =>{
        this.Publications = res;
        this.Auxiliar = this.Publications;
        this.homeService.GetFriendly_Request(this.iduser).subscribe((res:Friends[])=>{   
          this.Friend_Request = res;
          ids += ","
          for(var i =0; i< this.Friend_Request.length; i++){
            ids += this.Friend_Request[i].id + ",";
            this.SeeButtonFriend = true;
          }
          this.homeService.GetSetFriendly_Request(this.iduser).subscribe((res:GetSetFR[])=>{
            this.GetSetFR = res;
            for(var i =0;i<this.GetSetFR.length; i++){
              ids += this.GetSetFR[i]['iduser2'] + ",";
            }
            ids = ids.substring(0,ids.length-1);
            this.homeService.GetUsers(ids).subscribe((res:Friends[]) =>{
              this.Usuarios = res;
              if(this.Usuarios.length>0){
                this.SeeButtonFriend3 = true;
              }
            })
          })
      })
      })
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
    this.SeeTextTag = true;
    console.log("Imagen: ", this.image)
  }

  onUpload(){
    let formData = new FormData();
    formData.append("uploads[]",this.uploadedFiles[0], this.uploadedFiles[0].name);
      // Llamar al Service
    this.crudService.uploadFile(formData).subscribe((res)=>{
      this.image = res.ruta;
    })
  }

  NewPost(){
    this.crudService.NewPost(this.text,this.iduser,this.image,this.tags).subscribe((res:Publications[])=>{
    });
    if(this.image!=""){
      Swal.fire({
        title: 'Se ha compartido tu publicacion',
        text: "",
        icon: 'success',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.onUpload();
        }
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
    if(this.idfriend!=-1){
      this.homeService.SetFriendly_Request(this.iduser, Number(this.idfriend)).subscribe((res)=>{
      });
      for(var i=0;i<this.Usuarios.length;i++){
        if(this.Usuarios[i].id==this.idfriend){
          this.Usuarios.splice(i,1)
        }
      }
      if(this.Usuarios == []){
        this.SeeButtonFriend3 = false;
      }
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Solicitud enviada correctamente :3',
        showConfirmButton: false,
        timer: 1500
      })
      this.idfriend = -1;

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
  
  AceptFriend(){
    if(this.idfriend!=-1)
    {
      this.homeService.DeleteFriendRequest(Number(this.idfriend), this.iduser).subscribe((res)=>
      {
        this.homeService.AceptFriend(this.iduser, Number(this.idfriend)).subscribe((res)=>
        {
          var ids="";
          this.homeService.GetFriends(this.iduser).subscribe((res:Friends[]) =>
          {
            this.Amigos = res;
            for(var i = 0; i<this.Amigos.length;i++)
            {
              ids += this.Amigos[i].id +",";
              this.SeeButtonFriend2 = true;
            }
            ids += this.iduser
            this.homeService.GetPublications(ids).subscribe((res:Publications[]) =>
            {
              this.Publications = res;
              this.homeService.GetFriendly_Request(this.iduser).subscribe((res:Friends[])=>
              {   
                this.Friend_Request = res;
                ids += ","
                for(var i =0; i< this.Friend_Request.length; i++)
                {
                  ids += this.Friend_Request[i].id + ",";
                  this.SeeButtonFriend = true;
                }
              })
            })
          })
        })
        this.idfriend = -1;
      });
      Swal.fire({
        title: 'Nuevo Amigo Agregado',
        text: "",
        icon: 'success',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar'
      })
      
    }
  }

  FilterPublic(){
    if(this.tag!=""){
      this.Publications = [];
      this.homeService.FilterPublication(this.tag).subscribe((res:Publications[])=>{
        this.Filter = res;
        for(var a = 0; a<this.Auxiliar.length; a++){
          for(var e = 0; e<this.Filter.length; e++){
            if(this.Auxiliar[a].id == this.Filter[e]['idUser']){
              this.Publications.push(this.Auxiliar[a])
            }
          }
        }
      })
    }
    else{
      this.Publications = this.Auxiliar
    }
  } 
}