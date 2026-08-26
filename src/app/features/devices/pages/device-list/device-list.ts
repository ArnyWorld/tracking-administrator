import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DeviceService } from '../../services/device/device.service';
import { UiUtilsService } from '../../../../core/services/utils/ui-utils.service';
import { ConfirmService } from '../../../../core/services/confirm/confirm.service';
import { Router, RouterLink } from '@angular/router';
import { DataTableColumn, DataTableComponent } from '../../../../shared/data-table/data-table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageEvent } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-device-list',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    DataTableComponent,
  ],
  templateUrl: './device-list.html',
  styleUrl: './device-list.css',
})
export class DeviceList implements OnInit, AfterViewInit {
  private readonly deviceService = inject(DeviceService);
  private readonly messageService = inject(UiUtilsService);
  private readonly confirmService = inject(ConfirmService);
  private readonly router = inject(Router);

  @ViewChild('brandTemplate')
  brandTemplate!: TemplateRef<unknown>;

  @ViewChild('modelTemplate')
  modelTemplate!: TemplateRef<unknown>;

  @ViewChild('imeiTemplate')
  imeiTemplate!: TemplateRef<unknown>;

  @ViewChild('deviceTemplate')
  deviceTemplate!: TemplateRef<unknown>;

  @ViewChild('gpsspecTemplate')
  gpsspecTemplate!: TemplateRef<unknown>;

  isLoading = signal(false);

  pageIndex = 0;
  pageSize = 10;
  total = 0;

  columns: DataTableColumn<DeviceTableRow>[] = [];

  devices: DeviceTableRow[] = [];

  vehicles = signal<DeviceTableRow[]>([]);
  apps = signal<DeviceTableRow[]>([]);

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.columns = [
      {
        key: 'brand',
        label: 'Marca',
        template: this.brandTemplate,
      },
      {
        key: 'model',
        label: 'Modelo',
        template: this.modelTemplate,
      },
      {
        key: 'imei',
        label: 'IMEI',
        template: this.imeiTemplate,
      },
      {
        key: 'gpsspec',
        label: 'Especificación',
        template: this.gpsspecTemplate,
      },
    ];

    this.getDevices();
  }

  getDevices(): void {
    this.isLoading.set(true);

    this.deviceService.getAll().subscribe({
      next: (response: any) => {
        const content: DeviceResponse[] = response?.content ?? [];

        const mappedDevices = content.map(
          (device): DeviceTableRow => ({
            id: device.id,

            brand: device.info_brand ?? '',

            model: device.info_model ?? '',

            imei: device.imei ? String(device.imei) : '',

            device: device.info_device ?? '',

            gpsspec: device.gpsspec?.name ?? device.gpsspec_id ?? '',

            type: device.imei ? 'vehicle' : 'app',
          }),
        );

        this.devices = mappedDevices;

        this.vehicles.set(mappedDevices.filter((device) => device.type === 'vehicle'));

        this.apps.set(mappedDevices.filter((device) => device.type === 'app'));

        this.total = response?.pagination?.rowsNumber ?? mappedDevices.length;

        this.isLoading.set(false);
      },

      error: () => {
        this.isLoading.set(false);

        this.messageService.error('Error al cargar los dispositivos.');
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  reload(): void {
    this.pageIndex = 0;
    this.getDevices();
  }

  createDevice(): void {
    this.router.navigate(['/app/device/create']);
  }

  editDevice(device: DeviceTableRow): void {
    this.router.navigate(['/device/edit', device.id]);
  }

  deleteDevice(device: DeviceTableRow): void {
    this.confirmService.confirm(() => this.removeDevice(device.id), {
      title: 'Eliminar dispositivo',

      content: `
          ¿Está seguro de eliminar el dispositivo
          "${device.imei || device.id}"?
        `,

      okText: 'Eliminar',

      cancelText: 'Cancelar',

      danger: true,
    });
  }

  removeDevice(id: string): void {
    console.log('Eliminar dispositivo:', id);
  }
}
