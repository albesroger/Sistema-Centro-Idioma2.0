import { Component } from '@angular/core';
import { User } from '../../../interfaces/user';
import { UserServiceService } from '../../../services/userService.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-current-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './currentUsers.component.html',
})
export class CurrentUsersComponent {
  listUser: User[] = [];

  name?: string = '';
  lastname?: string = '';
  email: string = '';
  password: string = '';
  rol?: string = '';
  userEditing: User | null = null;

  constructor(
    private _userService: UserServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this._userService.getUser().subscribe((data) => {
      console.log(data);
      this.listUser = data;
    });
  }

  addUser() {
    if (this.userEditing) {
      // Actualizar producto existente
      const updatedUser: User = {
        ...this.userEditing,
        id: this.userEditing.id,
        name: this.name,
        lastname: this.lastname,
        email: this.email,
        password: this.password,
        rol: this.rol || 'profesor',
      };

      this._userService.updateUser(updatedUser).subscribe({
        next: (data) => {
          // Actualizar la lista completa después de la actualización
          this.getUser();
          this.toastr.success('Usuario actualizado', 'Éxito');
          this.clearForm();
        },
        error: (error) => {
          this.toastr.error('Error al actualizar el producto', 'Error');
        },
      });
    } else {
      const user: User = {
        name: this.name,
        lastname: this.lastname,
        email: this.email,
        rol: this.rol || 'profesor',
        password: this.password,
      };

      this._userService.signIn(user).subscribe({
        next: (data) => {
          // Actualizar la lista completa después de agregar
          this.getUser();
          this.toastr.success('Producto agregado', 'Éxito');
          this.clearForm();
        },
        error: (error) => {
          this.toastr.error('Error al agregar el producto', 'Error');
        },
      });
    }
    this.getUser();
  }

  updateUser(user: User) {

    this.userEditing = user;
    this.name = user.name || '';
    this.lastname = user.lastname || '';
    this.email = user.email || '';
    this.rol = user.rol || 'profesor';
   
  }

  deleteUser(id: number | undefined) {
    if (!id) {
      this.toastr.error('ID de usuario no válido', 'Error');
      return;
    }
    this._userService.deleteUser(id).subscribe({
      next: (data) => {
        // Actualizar la lista completa después de eliminar
        this.getUser();
        this.toastr.success('Usuario eliminado', 'Éxito');
      },
      error: (error) => {
        this.toastr.error('Error al eliminar el usuario', 'Error');
      },
    });
    this.getUser();
  }

  clearForm() {
    this.name = '';
    this.lastname = '';
    this.email = '';
    this.rol = '';
  }
}
