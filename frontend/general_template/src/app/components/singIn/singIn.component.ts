import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../interfaces/user';
import { UserServiceService } from '../../services/userService.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { ErrorsService } from '../../services/errors.service';

@Component({
  selector: 'app-sing-in',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SpinnerComponent],
  templateUrl: './singIn.component.html',
})
export class SingInComponent implements OnInit {
  id: number = 0;
  name: string = '';
  lastname: string = '';
  email: string = '';
  password: string = '';
  repeatPassword: string = '';
  credencial: string = '';
  rol: string = 'profesor';

  loading: boolean = false;

  constructor(
    private toastr: ToastrService,
    private _userService: UserServiceService,
    private router: Router,
    private _errorsService: ErrorsService
  ) {}

  ngOnInit(): void {}

  addUser() {
    if (
      this.name == '' ||
      this.lastname == '' ||
      this.email == '' ||
      this.password == '' ||
      this.repeatPassword == '' ||
      this.credencial == ''
    ) {
      this.toastr.error('Por favor, complete todos los campos', 'Error');
      return;
    }
    if (this.password != this.repeatPassword) {
      this.toastr.warning('Las contraseñas no coinciden', 'Error');
      return;
    }
    if (this.password.length < 6) {
      this.toastr.warning(
        'La contraseña debe tener al menos 6 caracteres',
        'Error'
      );
      return;
    }
    if (this.repeatPassword.length < 6) {
      this.toastr.warning(
        'La contraseña debe tener al menos 6 caracteres',
        'Error'
      );
      return;
    }

    //Crear el objeto(user)
    const user: User = {
      id: this.id,
      name: this.name,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
      credencial: this.credencial,
      rol: this.rol,
    };
    this.loading = true;

    this._userService.signIn(user).subscribe({
      next: (v) => {
        this.loading = false;
        this.toastr.success(
          `Cuenta de ${user.name}${user.lastname} creada correctamente`,
          'Exito'
        );
        this.router.navigate(['/login']);
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this._errorsService.messageError(e);
      },
      complete: () => console.info('complete'),
    });

    //this._userService.signIn(user).subscribe(
    //  (data) => {
    //    this.loading = false;
    //    this.toastr.success(
    //      `Cuenta de ${user.name}${user.lastname} creada correctamente`,
    //      'Exito'
    //    );
    //    this.router.navigate(['/login']);
    //  },
    //  (event: HttpErrorResponse) => {
    //    this.loading = false;
    //    if (event.error.msg) {
    //      console.log(event.error.msg);
    //      this.toastr.warning(event.error.msg, 'Error');
    //      return;
    //    } else {
    //      this.toastr.error('Existe un error en el servidor', 'Error');
    //    }
    //  }
    //);
  }
}
