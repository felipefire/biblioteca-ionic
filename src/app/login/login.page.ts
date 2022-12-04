import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Credenciales } from '../interfaces/credenciales.interface';
import { SesionService } from '../servicios/sesion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup = new FormGroup({
    ciCtrl: new FormControl<number>(null, [Validators.required]),
    passwordCtrl: new FormControl<string>(null, [Validators.required])
  });

  constructor(
    private servicioSesion: SesionService,
    private servicioToast: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  iniciarSesion(){
    this.servicioSesion.iniciar(this.getCredenciales()).subscribe({
      next: (respuesta)=>{
        console.log('Inicio de sesion correcto', 'el token es: ', respuesta.token);
        this.servicioToast.create({
          header:'Inicio de sesion correcto',
          duration: 3000,
          position: 'bottom',
          color: 'success'
        }).then(toast => toast.present());
        this.router.navigate(['/home']);
      },
      error: (e) => {
        if(e.status === 401){
          this.servicioToast.create({
            header: 'Error al iniciar sesion',
            message:'No. documento o contraseña incorrecta',
            duration: 3000,
            position: 'bottom',
            color: 'danger'
          }).then(toast => toast.present());
        }else{
          this.servicioToast.create({
            header: 'Error al iniciar sesion',
            message: e.message,
            duration: 3000,
            position: 'bottom',
            color: 'danger'
          }).then(toast => toast.present());

        }
        console.error('Error al iniciar sesion')
      }
    })
  }

    private getCredenciales(): Credenciales{
      return{
        ci: this.form.controls.ciCtrl.value,
        password: this.form.controls.passwordCtrl.value
      }
    }

  }

