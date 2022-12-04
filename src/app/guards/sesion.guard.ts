import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { SesionService } from '../servicios/sesion.service';

@Injectable({
  providedIn: 'root'
})
export class SesionGuard implements CanActivate {

  constructor(
    private servicoSesion: SesionService,
    private router: Router
  ){

  }



  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.servicoSesion.token){
        const jwtHelper: JwtHelperService = new JwtHelperService();
        if(jwtHelper.isTokenExpired(this.servicoSesion.token)){
          return this.router.createUrlTree(['/login']);
        }else{
          return true; 
        }
      }else{
        return this.router.createUrlTree(['/login']);
      }
    
  }
  
}
