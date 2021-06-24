import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserInterface } from "../models/user-interface";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  //TO-DO: Get Users
  GetUsers(){
    const url = 'http://localhost:3000/getUsers';
    return this.http.get<any>(url);
  }

  //TO-DO: Insert Users
  InsertUser(name:string, username:string, password:string)
  {
    const url = 'http://localhost:3000/addUser';
    return this.http.post<any>(
      url,
      {
        "name": name,
        "username": username,
        "password":password
      }
    ).pipe(map(data => data));
  }
  //TO-DO: Update Users
  UpdateUser(name:string, username:string, password:string){
    const url = 'http://localhost:3000/updateUser';
    return this.http.put<any>(
      url,
        {
          "name": name,
          "username":username,
          "password":password
        },
        {
          headers: this.headers
        }
    ).pipe(map(data => data));
  }
  //TO-DO: Delete Users
}
