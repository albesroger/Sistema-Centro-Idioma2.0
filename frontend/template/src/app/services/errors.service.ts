import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import e from 'express';

@Injectable({
  providedIn: 'root',
})
export class ErrorsService {
  static messageError(error: { (...data: any[]): void; (message?: any, ...optionalParams: any[]): void; }) {
    throw new Error('Method not implemented.');
  }
  constructor(private toastr: ToastrService) {}

  messageError(e: HttpErrorResponse) {
    if (e.error.msg) {
      console.log(e.error.msg);
      this.toastr.warning(e.error.msg, 'Error');
    } else {
      this.toastr.error('Existe un error en el servidor', 'Error');
    }
  }
}
