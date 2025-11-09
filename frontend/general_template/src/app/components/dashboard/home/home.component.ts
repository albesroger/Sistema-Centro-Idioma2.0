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
  totalEstudiantes = 0;
  totalProfesores = 0;
  cursosActivos = 0;
  proximasClases = 0;

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
    this.userService.getUser().subscribe((usuarios) => {
      // Contar estudiantes y profesores
      this.totalEstudiantes = usuarios.filter(
        (u: any) => u.rol === 'estudiante'
      ).length;
      this.totalProfesores = usuarios.filter(
        (u: any) => u.rol === 'profesor'
      ).length;

      // Datos de ejemplo
      this.cursosActivos = 5;
      this.proximasClases = 3;

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
              label: 'Nuevos Estudiantes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: '#3b82f6',
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true },
          },
          plugins: {
            title: {
              display: true,
              text: 'Inscripciones Mensuales',
            },
          },
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
            rol === 'estudiante'
              ? 'Estudiantes'
              : rol === 'profesor'
              ? 'Profesores'
              : 'Otros'
          ),
          datasets: [
            {
              data: Object.values(rolesUsuarios),
              backgroundColor: ['#3b82f6', '#10b981', '#6b7280'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Distribución de Usuarios',
            },
          },
        },
      });
    }
  }
}
