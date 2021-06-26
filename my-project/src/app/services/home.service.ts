import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http:HttpClient, private router:Router) { }
  headers:HttpHeaders = new HttpHeaders({
    "Content-Type":"application/json"
  });

  //To-Do: Get Publications
  GetPublications(){
    const url = 'http://localhost:3000/getPublications';
    return this.http.get<any>(url);
  }
  //To-Do: LogOut
  LogOut(){
    
    localStorage.removeItem('User_Logged');
    this.router.navigate(['/login'])
  }

}
