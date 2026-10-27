import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '../../../../shared/data-table/data-table';
import { AssignmentDeviceService } from '../../services/assignment-device/assignment-device.service';
import { UiUtilsService } from '../../../../core/services/utils/ui-utils.service';
import { ConfirmService } from '../../../../core/services/confirm/confirm.service';
import { DataTableColumn } from '../../../../core/models/table-column.interface';
import { AssignmentResponse } from '../../models/device.interface';
import { PageEvent } from '@angular/material/paginator';
import { DeviceVehicleService } from '../../services/device-vehicle/device-vehicle.service';
import { NoCompany } from '../../../../shared/no-company/no-company';

@Component({
  selector: 'app-assignment-list',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    NoCompany,
  ],
  templateUrl: './assignment-list.html',
  styleUrl: './assignment-list.css',
})
export class AssignmentList implements OnInit, AfterViewInit {
  private assignmentService = inject(DeviceVehicleService);
  private uiUtilsService = inject(UiUtilsService);
  private confirmService = inject(ConfirmService);
  private router = inject(Router);
  public companySelected = localStorage.getItem('company');
  @ViewChild('vehicleNameTemplate')
  vehicleNameTemplate!: TemplateRef<unknown>;

  @ViewChild('vehiclePlateTemplate')
  vehiclePlateTemplate!: TemplateRef<unknown>;

  @ViewChild('vehicleBrandTemplate')
  vehicleBrandTemplate!: TemplateRef<unknown>;

  @ViewChild('deviceNameTemplate')
  deviceNameTemplate!: TemplateRef<unknown>;

  @ViewChild('deviceImeiTemplate')
  deviceImeiTemplate!: TemplateRef<unknown>;
  isLoading = signal(false);
  total: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  columns: DataTableColumn<AssignmentResponse>[] = [];
  assignmentsDevice: AssignmentResponse[] = [];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.columns = [
      {
        key: 'device',
        label: 'Unidad',
        template: this.vehicleNameTemplate,
      },

      {
        key: 'vehiclePlate',
        label: 'Placa',
        template: this.vehiclePlateTemplate,
      },
      {
        key: 'vehicleBrand',
        label: 'Marca',
        template: this.vehicleBrandTemplate,
      },
      {
        key: 'deviceName',
        label: 'Dispositivo',
        template: this.deviceNameTemplate,
      },
      {
        key: 'deviceImei',
        label: 'IMEI',
        template: this.deviceImeiTemplate,
      },
    ];

    this.getAssignments();
  }

  getAssignments(): void {
    this.isLoading.set(true);

    this.assignmentService.getAllPaginate(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        const updatedData = response.content.map((item) => {
          return {
            ...item,
            vehicle: item?.vehicle
              ? {
                  ...item?.vehicle,
                  metadata: JSON.parse(item?.vehicle?.metadata),
                }
              : null,
          };
        });
        console.log('updatedData: ', updatedData);
        this.assignmentsDevice = updatedData ?? [];
        this.total = response.pagination?.rowsNumber ?? 0;

        this.isLoading.set(false);
      },

      error: () => {
        this.isLoading.set(false);

        this.uiUtilsService.error('No se recuperaron las asignaciones registradas.');
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;

    this.pageSize = event.pageSize;

    this.getAssignments();
  }

  reload(): void {
    this.pageIndex = 0;

    this.getAssignments();
  }

  createAssignment(): void {
    this.router.navigate(['/app/assignment/create']);
  }

  editCompany(assignment: AssignmentResponse): void {
    this.router.navigate(['/app/company/edit', assignment.id]);
  }

  deleteCompany(assignment: AssignmentResponse): void {
    this.confirmService.confirm(() => this.removeAssignment(assignment?.id), {
      title: 'Eliminar empresa',

      content: `¿Está seguro de eliminar la asignación "${assignment?.vehicle?.name}" - ${assignment.vehicle?.metadata?.brand}?`,

      okText: 'Eliminar',

      cancelText: 'Cancelar',

      danger: true,
    });
  }

  removeAssignment = (id: string) => {
    console.log('Eliminando...');
  };
}
