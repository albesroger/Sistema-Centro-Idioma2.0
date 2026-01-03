import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.html',
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  breadcrumbs: Breadcrumb[] = [];
  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.withHome(
          this.buildBreadcrumbs(this.route.root)
        );
        console.log('BC:', this.breadcrumbs); // por si quieres ver qué arma
      });

    // primera carga
    this.breadcrumbs = this.withHome(this.buildBreadcrumbs(this.route.root));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private buildBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const child = route.firstChild;
    if (!child) return breadcrumbs;

    const routeConfig = child.routeConfig;
    if (!routeConfig) {
      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    const routePath = routeConfig.path ?? '';
    const nextUrl = routePath ? `${url}/${routePath}` : '/';

    const label = routeConfig.data?.['breadcrumb'] as string | undefined;
    if (label) {
      breadcrumbs.push({ label, url: nextUrl });
    }

    return this.buildBreadcrumbs(child, nextUrl, breadcrumbs);
  }

  private withHome(crumbs: Breadcrumb[]): Breadcrumb[] {
    // si no hay nada, devolvemos solo Home
    if (!crumbs.length) {
      return [{ label: 'Home', url: 'inicioPage' }];
    }

    // si estamos en la Home (ruta '') → solo Home
    if (
      crumbs.length === 1 &&
      (crumbs[0].url === '/' || crumbs[0].label.toLowerCase() === 'home')
    ) {
      return [{ label: 'Home', url: "inicioPage" }];
    }

    // si ya empieza en Home, dejarlo
    if (crumbs[0].url === '/' || crumbs[0].label.toLowerCase() === 'home') {
      return crumbs;
    }

    // en cualquier otro caso, anteponer Home
    return [{ label: 'Home', url: '/' }, ...crumbs];
  }
}
