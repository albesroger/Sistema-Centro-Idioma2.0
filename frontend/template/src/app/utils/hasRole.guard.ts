import { inject } from '@angular/core';
import {
  type CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { UserServiceService } from '../services/userService.service';

export const hasRoleGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserServiceService);
  const router = inject(Router);

  return userService.loadUser().pipe(
    map((user) => {
      if (user.rol === 'admin') {
        return true;
      }

      return router.createUrlTree(['/dashboard/inicio']) as UrlTree;
    }),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
