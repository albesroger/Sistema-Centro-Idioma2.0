import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/userService.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorsService } from '../../services/errors.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SpinnerComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(
    private _userService: UserServiceService,
    private toastr: ToastrService,
    private router: Router,
    private _errorsService: ErrorsService
  ) {}

  login() {
    if (this.email == '' || this.password == '') {
      this.toastr.error('Por favor, complete todos los campos', 'Error');
      return;
    }

    //Crear el objeto(user)
    const user: User = {
      email: this.email,
      password: this.password,
    };

    this.loading = true;

    this._userService.login(user).subscribe({
      next: (response: any) => {
        //console.log(token);
        const token = response.token;
        this.loading = false;
        this.toastr.success(
          `Cuenta de ${user.email} iniciada correctamente`,
          'Exito'
        );
        this.router.navigate(['/homePage']);
        localStorage.setItem('myToken', token);
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this._errorsService.messageError(e);
      },
    });
  }
}
