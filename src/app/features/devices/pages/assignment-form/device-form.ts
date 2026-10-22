import {
  Component,
  DestroyRef,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
  ElementRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { filter, finalize, forkJoin, Observable, switchMap, tap } from 'rxjs';
import { VehicleService } from '../../services/vehicle/vehicle.service';
import { DeviceService } from '../../services/device/device.service';
import { GpsSensorService } from '../../services/gps-sensor/gps-sensor.service';
import { DeviceVehicleService } from '../../services/device-vehicle/device-vehicle.service';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { UiUtilsService } from '../../../../core/services/utils/ui-utils.service';
import { ConfirmService } from '../../../../core/services/confirm/confirm.service';
import { CompanyService as CompanyByUserService } from '../../services/company/company.service';
interface Vehicle {
  id: string;
  name?: string;
  metadata: { brand?: string; model?: string };
  device?: unknown[];
  [key: string]: any;
}
interface Device {
  id: string;
  name?: string;
  imei?: string | number;
  gpsspec?: { id: string };
}

const normalize = (value: unknown): string =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

@Component({
  selector: 'app-device-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './device-form.html',
  styleUrl: './device-form.css',
})
export class DeviceForm implements OnInit {
  private readonly vehiclesService = inject(VehicleService);
  private readonly devicesService = inject(DeviceService);
  private readonly companyService = inject(CompanyByUserService);
  private readonly gpsSensorService = inject(GpsSensorService);
  private readonly deviceVehicleService = inject(DeviceVehicleService);
  private readonly utils = inject(UtilsService);
  private readonly ui = inject(UiUtilsService);
  private readonly confirmService = inject(ConfirmService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly vehicleInput = viewChild<ElementRef<HTMLInputElement>>('vehicleSearchInput');
  private readonly deviceInput = viewChild<ElementRef<HTMLInputElement>>('deviceSearchInput');

  readonly enterprises = signal<any[]>([]);
  readonly vehicles = signal<Vehicle[]>([]);
  readonly devices = signal<Device[]>([]);
  readonly sensors = signal<any[]>([]);
  readonly selectedSensors = signal<Set<string>>(new Set());

  readonly vehicleSearch = signal('');
  readonly deviceSearch = signal('');

  readonly isLoadingEnterprises = signal(false);
  readonly isLoadingVehicles = signal(false);
  readonly isLoadingDevices = signal(false);

  readonly deviceVehicleId = this.route.snapshot.paramMap.get('id') ?? undefined;
  readonly isEditMode = !!this.deviceVehicleId;

  readonly filteredVehicles = computed(() => {
    const term = normalize(this.vehicleSearch()).trim();
    const list = this.vehicles();
    if (!term) return list;
    return list.filter((v) =>
      [v.name, v.metadata?.brand, v.metadata?.model].some((f) => normalize(f).includes(term)),
    );
  });

  readonly filteredDevices = computed(() => {
    const term = normalize(this.deviceSearch()).trim();
    const list = this.devices();
    if (!term) return list;
    return list.filter((d) => [d.name, d.imei].some((f) => normalize(f).includes(term)));
  });

  readonly formAssignment = this.fb.group({
    enterprise_id: [null as any, Validators.required],
    vehicle_id: [null as string | null, Validators.required],
    device_id: [null as string | null, Validators.required],
    observations: [null as string | null],
    create_date: [new Date()],
    install_date: [null as Date | null, Validators.required],
  });

  ngOnInit(): void {
    this.formAssignment.controls.enterprise_id.valueChanges
      .pipe(
        tap(() => this.resetCatalogs()),
        filter((e) => !!e?.databases?.[0]?.codename),
        switchMap((e) => this.loadCatalogs(e.databases[0].codename)), // switchMap cancela peticiones previas
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.formAssignment.controls.device_id.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => {
        this.selectedSensors.set(new Set());
        this.loadSensorsFor(id);
      });

    this.loadEnterprises();
  }

  onPanelToggle(opened: boolean, type: 'vehicle' | 'device'): void {
    if (opened) {
      setTimeout(() =>
        (type === 'vehicle' ? this.vehicleInput() : this.deviceInput())?.nativeElement.focus(),
      );
    } else {
      (type === 'vehicle' ? this.vehicleSearch : this.deviceSearch).set('');
    }
  }

  compareById = (a: any, b: any) => a?.id === b?.id;

  getNameAndImei(device: Device): string {
    return `${device.name ?? ''} - ${device.imei ?? ''}`;
  }

  private resetCatalogs(): void {
    this.vehicles.set([]);
    this.devices.set([]);
    this.sensors.set([]);
    this.formAssignment.patchValue({ vehicle_id: null, device_id: null }, { emitEvent: false });
  }

  private loadEnterprises(): void {
    this.isLoadingEnterprises.set(true);
    this.companyService
      .getAll()
      .pipe(finalize(() => this.isLoadingEnterprises.set(false)))
      .subscribe({
        next: (res) => {
          this.enterprises.set(this.utils.getResponseGeneral(res) ?? []);
          if (this.deviceVehicleId) this.loadAssignment(this.deviceVehicleId);
        },
        error: () => this.ui.error('No se pudieron recuperar las empresas.'),
      });
  }

  private loadCatalogs(db: string): Observable<unknown> {
    this.isLoadingVehicles.set(true);
    this.isLoadingDevices.set(true);

    return forkJoin({
      vehicles: this.vehiclesService.getAll(db),
      devices: this.devicesService.getAllDevicesWithImei(db),
    }).pipe(
      tap({
        next: ({ vehicles, devices }) => {
          this.vehicles.set(
            (this.utils.getResponseGeneral(vehicles) ?? []).map((v: any) => ({
              ...v,
              metadata: this.parseMetadata(v.metadata),
            })),
          );
          this.devices.set(this.utils.getResponseGeneral(devices) ?? []);
        },
        error: () => this.ui.error('No se pudieron recuperar vehículos y dispositivos.'),
      }),
      finalize(() => {
        this.isLoadingVehicles.set(false);
        this.isLoadingDevices.set(false);
      }),
    );
  }

  private parseMetadata(raw: unknown): Vehicle['metadata'] {
    if (typeof raw !== 'string') return (raw as Vehicle['metadata']) ?? {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  private loadSensorsFor(deviceId: string | null): void {
    console.log('deviceId: ', deviceId);
    const gpsSpecId = this.devices().find((d) => d.id === deviceId)?.gpsspec?.id;
    if (!gpsSpecId) {
      this.sensors.set([]);
      return;
    }
    this.gpsSensorService.find(gpsSpecId).subscribe({
      next: (res) => {
        console.log('res sensor by device', res);
        this.sensors.set(this.utils.getResponseGeneral(res) ?? []);
      },
      error: () => this.ui.error('No se pudieron recuperar los sensores.'),
    });
  }

  private loadAssignment(id: string): void {
    console.log('id loadAssignment: ', id);
    this.deviceVehicleService.find(id).subscribe({
      next: (res) => {
        const data = this.utils.getResponseGeneral(res).find((e: any) => e?.id === id);
        if (!data) return;

        const enterprise = this.enterprises().find((e) => e.id === data.enterprise_id);
        const db = enterprise?.databases?.[0]?.codename;
        if (!db) return;

        this.formAssignment.patchValue({ enterprise_id: enterprise }, { emitEvent: false });

        this.loadCatalogs(db).subscribe(() => {
          this.formAssignment.patchValue(
            {
              vehicle_id: data.vehicle?.id ?? data.vehicle_id,
              device_id: data.device_id,
              observations: data.observations,
              create_date: data.create_date ? new Date(data.create_date) : null,
              install_date: data.install_date ? new Date(data.install_date) : null,
            },
            { emitEvent: false },
          );
          this.loadSensorsFor(data.device_id);
          this.selectedSensors.set(new Set((data.sensors ?? []).map((s: any) => s.sensor_id)));
        });
      },
      error: () => this.ui.error('Error al cargar los datos.'),
    });
  }

  toggleSensor(sensorId: string, checked: boolean): void {
    this.selectedSensors.update((set) => {
      const next = new Set(set);
      checked ? next.add(sensorId) : next.delete(sensorId);
      return next;
    });
  }

  showConfirm(): void {
    this.formAssignment.markAllAsTouched();
    if (this.formAssignment.invalid) {
      this.ui.warning('Llene los campos obligatorios.');
      return;
    }

    const action = this.isEditMode ? 'actualizar' : 'registrar';
    this.confirmService.confirm(() => this.submit(), {
      title: this.isEditMode ? 'Actualizar asignación' : 'Registrar asignación',
      content: `¿Está seguro de que desea ${action} la asignación del dispositivo?`,
      danger: false,
    });
  }

  private submit(): void {
    const payload = {
      ...this.formAssignment.getRawValue(),
      sensors: [...this.selectedSensors()].map((sensor_id) => ({ sensor_id })),
    };

    const request$ = this.isEditMode
      ? this.deviceVehicleService.update(payload, this.deviceVehicleId!)
      : this.deviceVehicleService.register(payload);

    request$.subscribe({
      next: () => {
        this.ui.success(
          `Se ${this.isEditMode ? 'actualizó' : 'registró'} correctamente la asignación.`,
        );
        this.cancel();
      },
      error: () =>
        this.ui.error(`Error al ${this.isEditMode ? 'actualizar' : 'registrar'} la asignación.`),
    });
  }

  cancel(): void {
    this.router.navigate(['/list-assignments']);
  }
}
