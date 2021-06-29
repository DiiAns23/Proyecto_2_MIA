import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http:HttpClient, private router:Router) { }
  headers:HttpHeaders = new HttpHeaders({
    "Content-Type":"application/json"
  });

  //To-Do: Get Publications
  GetPublications(iduser:string){
    const url = 'http://localhost:3000/getPublications';
    return this.http.put<any>(
      url,
      {
        "id":iduser
      });
  }
  //To-Do: LogOut
  LogOut(){
    localStorage.removeItem('User_Logged');
    this.router.navigate(['/login'])
  }

  //
  LogOut1(){
    localStorage.removeItem('User_Logged');
  }

  //To-Do:
  GetFriends(iduser:number){
    const url = 'http://localhost:3000/getFriends';
    return this.http.put<any>(
      url,
      {
        "iduser": iduser
      }
      );
  }

  GetUsers(iduser:string){
    const url = 'http://localhost:3000/getNoFriends';
    return this.http.put<any>(
      url,
      {
        "id":iduser
      }
      );
  }

  SetFriendly_Request(iduser:number, iduser2:number){
    const url = 'http://localhost:3000/setFR';
    return this.http.put<any>(
      url,
      {
        "iduser": iduser,
        "iduser2": iduser2
      }
      );
  }

  GetFriendly_Request(iduser:number){
    const url = 'http://localhost:3000/getFR';
    return this.http.put<any>(
      url,
      {
        "iduser":iduser
      }
    )
  }
  GetSetFriendly_Request(iduser:number){
    const url = 'http://localhost:3000/getsetFR';
    return this.http.put<any>(
      url,
      {
        "iduser":iduser
      }
    )
  }

  DeleteFriendRequest(iduser1: number, iduser2: number){
    const url = 'http://localhost:3000/deleteFR/'+ iduser1 +"/"+iduser2;
    return this.http.delete<any>(url).pipe(map(data=>data))
  }

  AceptFriend(iduser1: number, iduser2: number){
    const url = 'http://localhost:3000/AceptFriend';
    return this.http.post<any>(
      url,
      {
        "iduser1": iduser1,
        "iduser2": iduser2
      }
    ).pipe(map(data => data));
  }
}
