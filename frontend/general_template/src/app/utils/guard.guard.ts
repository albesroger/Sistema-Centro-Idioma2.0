import { Router, type CanDeactivateFn } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { GuardService } from '../services/guard.service';

export const guardGuard: CanDeactivateFn<DashboardComponent> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  const authGuardService = new GuardService(new Router());

  return authGuardService.canDeactivate();
};
