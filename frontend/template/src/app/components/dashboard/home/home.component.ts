import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { UserServiceService } from '../../../services/userService.service';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../interfaces/task';
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

  constructor(
    private userService: UserServiceService,
    private taskService: TaskService,
  ) {}

  ngOnInit(): void {
    this.cargarDatosDashboard();
  }

  ngAfterViewInit(): void {
    // Los gráficos se inicializarán después de cargar los datos
  }

  private cargarDatosDashboard(): void {
    // Cargar usuarios y luego tareas
    this.userService.getUser().subscribe((usuarios: User[]) => {
      this.totalLider = usuarios.filter((user) => user.rol === 'lider').length;
      this.totalProfesores = usuarios.filter(
        (user) => user.rol === 'profesor',
      ).length;
      this.totalAdmin = usuarios.filter((user) => user.rol === 'admin').length;
      this.totalCalidad = usuarios.filter(
        (user) => user.rol === 'calidad',
      ).length;

      // Cargar tareas para generar el gráfico de barras
      this.taskService.getTask().subscribe((tareas: Task[]) => {
        this.configurarGraficos(usuarios, tareas);
      });
    });
  }

  private configurarGraficos(usuarios: any[], tareas: Task[]): void {
    // Destruir gráficos existentes
    if (this.barChart) {
      this.barChart.destroy();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    // Gráfico de barras - Inscripciones por mes usando fechas de tareas
    const lastN = 6;
    const spanishMonths = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];

    const labels: string[] = [];
    const now = new Date();
    for (let i = lastN - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(spanishMonths[d.getMonth()]);
    }

    const counts = new Array(lastN).fill(0);
    tareas.forEach((t) => {
      try {
        const date = new Date(t.date as any);
        if (isNaN(date.getTime())) return;
        const monthsDiff =
          (now.getFullYear() - date.getFullYear()) * 12 +
          (now.getMonth() - date.getMonth());
        if (monthsDiff >= 0 && monthsDiff < lastN) {
          const idx = lastN - 1 - monthsDiff; // 0 oldest ... last newest
          counts[idx]++;
        }
      } catch (e) {
        // ignorar fechas inválidas
      }
    });

    const barCtx = this.barChartRef?.nativeElement.getContext('2d');
    if (barCtx) {
      this.barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Inscripciones',
              data: counts,
              backgroundColor: '#3b82f6',
            },
          ],
        },
        options: { responsive: true },
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
              ? 'Administradores'
              : rol === 'profesor'
                ? 'Profesores'
                : rol === 'calidad'
                  ? 'Calidad'
                  : rol === 'lider'
                    ? 'Líderes'
                    : 'Otro',
          ),
          datasets: [
            {
              data: Object.values(rolesUsuarios),
              backgroundColor: [
                '#3b82f6',
                '#10b981',
                '#f59e0b',
                '#8b5cf6',
                '#6b7280',
              ],
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
