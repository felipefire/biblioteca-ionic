import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Credenciales } from '../interfaces/credenciales.interface';
import { Preferences } from '@capacitor/preferences';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class SesionService {

  url: string ="http://localhost:3000/sesion";
  token: string | null = null;//Con esta variable yo se si se inicio o no la sesiones
  private timer: any;

  constructor(
    private http: HttpClient    
  ) { 
    Preferences.get({key: 'token'}).then(pref =>{
      const jwtHelper: JwtHelperService = new JwtHelperService();
      if(jwtHelper.isTokenExpired()){
        this.token = null;
        Preferences.remove({key: 'token'})
      }else{
        this.token = pref.value;
        this.procesarToken(pref.value);
      }

    }).catch(e => {
      console.error('Error al cargar token desde Preferences', e);
    }) 
  }

  iniciar(cred: Credenciales): Observable<{token: string}>{
    return this.http.post<{token: string}>(`${this.url}/iniciar`, cred).pipe(
      tap(respuesta =>{
        this.token = respuesta.token;
        Preferences.set({key: 'token', value: respuesta.token});
        this.procesarToken(respuesta.token);
      })
    );
  }

  private manterner(token: string): Observable<{token: string}>{
    return this.http.post<{token: string}>(`${this.url}/mantener`,{token});
  }

  private procesarToken(token: string){
    const jwtHelper: JwtHelperService = new JwtHelperService();
    const expiracion: Date | null = jwtHelper.getTokenExpirationDate(token);
    if(expiracion){
      const renovacion: Date = new Date(expiracion.getTime()-15000);
      const ejecutarEn: number = renovacion.getTime() - Date.now();
      this.timer = setTimeout(() => {
        this.manterner(token).subscribe({ 
          next: (respuesta) => {
            console.log('Se renueva el token');
            this.token = respuesta.token;
            Preferences.set({key: 'token', value: respuesta.token});
            this.procesarToken(respuesta.token);
          },
          error:(e) =>{
            console.error('Error al renovar token', e);
            this.token = null;
            Preferences.remove({key: 'token'});
          }
        });
      },ejecutarEn);
    } 
  }

  cerrarSesion(){
    this.token = null;
    Preferences.remove({key: 'token'});
  }

}
