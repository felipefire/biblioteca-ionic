import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { libro } from '../interfaces/libro.interface';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  url: string = "http://localhost:3000/libro";

  constructor(
    private http: HttpClient
  ) { }
  public get(): Observable<libro[]>{
    return this.http.get<libro[]>(this.url);
  }
}
