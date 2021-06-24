import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { UserInterface } from "../../models/user-interface";
import { Router } from '@angular/router';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  iduser: number = -100;
  name: string = "";
  username: string = "";
  password: string = "";
  confirm_password: string = "";
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
        console.log('Este usuario ya esta en uso :c')
        return;
      }
    }
    if((this.password == this.confirm_password) && (this.password!="") && (this.confirm_password!=""))
    {
      
      this.crudService.InsertUser(this.name, this.username, this.password)
      .subscribe((res:UserInterface[]) =>{
        this.Usuarios = res,
        this.name = "",
        this.username = "",
        this.password = "",
        this.confirm_password = ""
      })
      console.log("Yes, register")
      this._router.navigate(["/login"]);
    }
    else{
      console.log("Please enter all fields");
    }
    
  }
  getDataUser(iduser:number, name:string, username:string, password:string){
    this.iduser = iduser;
    this.name = name;
    this.username = username;
    this.password = password;
  }

}
