import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService:UserService, private router:Router){}
  canActivate(){
    if(this.authService.GetCurrentUser()){
      return true;
    }else{
      this.router.navigate(['/login']);
      return false;
    }
  }
}
