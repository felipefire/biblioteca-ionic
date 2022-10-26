import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRefresher, ToastController } from '@ionic/angular';
import { libro } from '../interfaces/libro.interface';
import { LibrosService } from '../servicios/libros.service';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.page.html',
  styleUrls: ['./libros.page.scss'],
})
export class LibrosPage implements OnInit {
  @ViewChild(IonRefresher) refresher: IonRefresher;

   public listaLibros: libro[]=[]; 
   public cargandoLibros: boolean = false;

  constructor(
    private servicioLibros: LibrosService,
    private servicioToast: ToastController,
  ) { }

  ngOnInit() {
    this.cargarLibros();
  }
  public cargarLibros(){
    this.refresher?.complete()
    this.cargandoLibros = true;
    this.servicioLibros.get().subscribe({
      next: (libros) => {
        this.listaLibros = libros;
        this.cargandoLibros = false;
      } ,
      error: (e) => {
        console.error('Error al consultar libros',e);
        this.cargandoLibros=false;
        this.servicioToast.create({
          header: 'Error al Cargar libros',
          message: e.message,
          duration:3000,
          position:'bottom',
          color:'danger'
        }).then(toast => toast.present());
      }
    });
  }

}
