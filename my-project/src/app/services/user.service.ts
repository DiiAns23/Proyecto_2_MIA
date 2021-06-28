import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserInterface } from "../models/user-interface";
import { map } from "rxjs/operators";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient, private router:Router) { }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  //TO-DO: Get Users
  GetUsers(){
    const url = 'http://localhost:3000/getUsers';
    return this.http.get<any>(url);
  }

  //TO-DO: Insert Users
  InsertUser(name:string, username:string, password:string,image:string)
  {
    const url = 'http://localhost:3000/addUser';
    return this.http.post<any>(
      url,
      {
        "name": name,
        "username": username,
        "password":password,
        "image":image
      }
    ).pipe(map(data => data));
  }
  //TO-DO: Update Users
  UpdateUser(name:string, username:string, image:string, password:string, usernameantiguo:string){
    const url = 'http://localhost:3000/updateUser';
    return this.http.put<any>(
      url,
        {
          "name_": name,
          "username_":username,
          "image_":image,
          "password_":password,
          "usernameantiguo": usernameantiguo
        }
    )
  }

  //To-Do: Login
  LogIng(username:string, password:string){
    const url = 'http://localhost:3000/login'
    return this.http.post<any>(
      url, 
      {
        "username": username,
        "password": password
      }, 
      {
        headers:this.headers
      }).pipe(map(data=>data));
  }
  //TO-DO: Set Current User
  SetCurrentUser(user:UserInterface){
    let user_string = JSON.stringify(user);
    localStorage.setItem('User_Logged',user_string);

  }
  //To-Do Get Current User
  GetCurrentUser(){
    let userCurrent = localStorage.getItem('User_Logged');
    if(userCurrent!= null && userCurrent!=undefined){
      let user_json = JSON.parse(userCurrent);
      return user_json;
    }else{
      return null;
    }
  }
  //Cargar Imagen
  uploadFile(formData:any){
    const url = 'http://localhost:3000/subir';
    return this.http.post<any>(url, formData);
  }
  //To-Do New Post
  NewPost(text:string, iduser: number,image:string)
  {
    const url = 'http://localhost:3000/newPost';
    return this.http.post<any>(
      url,
      {
        "text": text,
        "iduser":iduser,
        "image": image
      }
    ).pipe(map(data => data));
  }
}
