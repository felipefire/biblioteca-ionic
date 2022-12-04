import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SesionService } from './servicios/sesion.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public servicioSesion: SesionService,
    private router: Router
  ) {}

  cerrarSesion(){
    this.servicioSesion.cerrarSesion();
    this.router.navigate(['/login']);
  }


}
