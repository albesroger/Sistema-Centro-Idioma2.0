import { Component } from '@angular/core';
import { TitlePageHomeComponent } from '../title_page_home/title_page_home.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'inicio-page',
  imports: [TitlePageHomeComponent, NavbarComponent, FooterComponent],
  templateUrl: './inicio_page.component.html',
})
export class InicioPageComponent {}
