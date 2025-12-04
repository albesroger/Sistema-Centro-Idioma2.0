import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { UserServiceService } from '../../../services/userService.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('barChart') private barChartRef!: ElementRef;
  @ViewChild('pieChart') private pieChartRef!: ElementRef;

  // Estadísticas
  totalLider = 0;
  totalProfesores = 0;
  totalAdmin = 0;
  totalCalidad = 0;

  private barChart: any;
  private pieChart: any;

  constructor(private userService: UserServiceService) {}

  ngOnInit(): void {
    this.cargarDatosDashboard();
  }

  ngAfterViewInit(): void {
    // Los gráficos se inicializarán después de cargar los datos
  }

  private cargarDatosDashboard(): void {
    this.userService.getUser().subscribe((usuarios: User[]) => {
      // Contar estudiantes y profesores
      this.totalLider = usuarios.filter(
        (user) => user.rol === 'lider'
      ).length;
      this.totalProfesores = usuarios.filter(
        (user) => user.rol === 'profesor'
      ).length;
      this.totalAdmin = usuarios.filter((user) => user.rol === 'admin').length;
      this.totalCalidad = usuarios.filter(
        (user) => user.rol === 'calidad'
      ).length;

      // Configurar gráficos
      this.configurarGraficos(usuarios);
    });
  }

  private configurarGraficos(usuarios: any[]): void {
    // Destruir gráficos existentes
    if (this.barChart) {
      this.barChart.destroy();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    // Gráfico de barras - Inscripciones por mes
    const barCtx = this.barChartRef?.nativeElement.getContext('2d');
    if (barCtx) {
      this.barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [
            {
              label: 'New Taks',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: '#3b82f6',
            },
          ],
        },
      });
    }

    // Gráfico de torta - Distribución de usuarios
    const rolesUsuarios = usuarios.reduce((acc: any, usuario: any) => {
      acc[usuario.rol || 'otro'] = (acc[usuario.rol || 'otro'] || 0) + 1;
      return acc;
    }, {});

    const pieCtx = this.pieChartRef?.nativeElement.getContext('2d');
    if (pieCtx) {
      this.pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: Object.keys(rolesUsuarios).map((rol) =>
            rol === 'admin'
              ? 'Administrator'
              : rol === 'profesor'
              ? 'Teachers'
              : rol === 'calidad'
              ? 'Quality Assurance'
              : rol === 'lider'
              ? 'Project leader'
              : ''
          ),
          datasets: [
            {
              data: Object.values(rolesUsuarios),
              backgroundColor: ['#3b82f6', '#10b981', '#6b7280', '#6b6280'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Distribution',
            },
          },
        },
      });
    }
  }
}
