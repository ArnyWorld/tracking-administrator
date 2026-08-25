import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UiUtilsService } from '../../../../core/services/utils/ui-utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmService } from '../../../../core/services/confirm/confirm.service';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { ApiResponse } from '../../../users/models/apiResponse.interface';
import { VehicleService } from '../../services/vehicle/vehicle.service';
import { AssignmentDeviceService } from '../../services/assignment-device/assignment-device.service';
import { GpsSensorService } from '../../services/gps-sensor/gps-sensor.service';
import { DeviceVehicleService } from '../../services/device-vehicle/device-vehicle.service';
import { DeviceService } from '../../services/device/device.service';

@Component({
  selector: 'app-device-form',
  imports: [
    CommonModule,

    ReactiveFormsModule,

    MatButtonModule,

    MatIconModule,

    MatFormFieldModule,

    MatInputModule,

    MatSelectModule,

    MatCheckboxModule,

    MatDatepickerModule,

    MatNativeDateModule,
  ],
  templateUrl: './device-form.html',
  styleUrl: './device-form.css',
})
export class DeviceForm implements OnInit {
  private vehiclesService = inject(VehicleService);

  private utilsService = inject(UtilsService);

  private uiUtilsService = inject(UiUtilsService);

  private assignmentDeviceService = inject(AssignmentDeviceService);

  private gpsSpecSensorService = inject(GpsSensorService);

  private deviceVehicleService = inject(DeviceVehicleService);

  private devicesService = inject(DeviceService);

  private fb = inject(FormBuilder);

  private router = inject(Router);

  private route = inject(ActivatedRoute);

  private confirmService = inject(ConfirmService);

  vehicleSearch = signal('');

  deviceSearch = signal('');

  arraySensors: any[] = [];

  arrayDevices: any[] = [];

  arrayVehicles: any[] = [];

  arrayEvents: string[] = [];

  deviceVehicleId?: string;

  isEditMode = false;

  formAssignment: FormGroup = this.fb.group({
    vehicle_id: [null, Validators.required],

    device_id: [null, Validators.required],

    sensors: [[]],

    observations: [null],

    create_date: [new Date()],

    install_date: [null, Validators.required],
  });

  ngOnInit(): void {
    this.deviceVehicleId = this.route.snapshot.paramMap.get('id') ?? undefined;

    this.isEditMode = !!this.deviceVehicleId;

    this.getVehicles();

    this.getDevices();

    this.onChangeDevice();

    if (this.deviceVehicleId) {
      this.getDeviceVehicle(this.deviceVehicleId);
    }
  }

  filteredVehicles = computed(() => {
    const search = this.vehicleSearch().trim().toLowerCase();

    if (!search) {
      return this.arrayVehicles;
    }

    return this.arrayVehicles.filter((vehicle) => {
      const name = vehicle.name?.toLowerCase() ?? '';

      const brand = vehicle.metadata?.brand?.toLowerCase() ?? '';

      const model = vehicle.metadata?.model?.toLowerCase() ?? '';

      return name.includes(search) || brand.includes(search) || model.includes(search);
    });
  });

  filteredDevices = computed(() => {
    const search = this.deviceSearch().trim().toLowerCase();

    if (!search) {
      return this.arrayDevices;
    }

    return this.arrayDevices.filter((device) => {
      const name = device.name?.toLowerCase() ?? '';

      const imei = device.imei?.toString().toLowerCase() ?? '';

      return name.includes(search) || imei.includes(search);
    });
  });

  onVehicleSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.vehicleSearch.set(input.value);
  }

  onDeviceSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.deviceSearch.set(input.value);
  }

  clearVehicleSearch(): void {
    this.vehicleSearch.set('');
  }

  clearDeviceSearch(): void {
    this.deviceSearch.set('');
  }

  getNameAndImei(device: any): string {
    return `${device.name ?? ''} - ${device.imei ?? ''}`;
  }

  getVehicles(): void {
    this.vehiclesService.getAll().subscribe({
      next: (response) => {
        this.arrayVehicles = this.utilsService.getResponseGeneral(response).map((vehicle: any) => {
          let metadata = {};

          try {
            metadata = JSON.parse(vehicle.metadata);
          } catch {
            metadata = {};
          }

          return {
            ...vehicle,
            metadata,
          };
        });
      },

      error: () => {
        this.uiUtilsService.error('No se pudieron recuperar los vehículos.');
      },
    });
  }

  getDevices(): void {
    this.devicesService.getAllDevicesWithImei().subscribe({
      next: (response: ApiResponse) => {
        this.arrayDevices = this.utilsService.getResponseGeneral(response);
      },

      error: () => {
        this.uiUtilsService.error('No se pudo recuperar los dispositivos.');
      },
    });
  }

  onChangeDevice(): void {
    this.formAssignment.get('device_id')?.valueChanges.subscribe((device: any) => {
      if (!device?.gpsspec?.id) {
        this.arraySensors = [];

        this.arrayEvents = [];

        return;
      }

      this.getSensorByDevice(device.gpsspec.id);
    });
  }

  getSensorByDevice(id: string): void {
    this.gpsSpecSensorService.find(id).subscribe({
      next: (response: ApiResponse) => {
        this.arraySensors = this.utilsService.getResponseGeneral(response);
      },

      error: () => {
        this.uiUtilsService.error('No se pudieron recuperar los sensores.');
      },
    });
  }

  toggleSensor(sensorId: string, checked: boolean): void {
    if (checked) {
      if (!this.arrayEvents.includes(sensorId)) {
        this.arrayEvents.push(sensorId);
      }
    } else {
      this.arrayEvents = this.arrayEvents.filter((id) => id !== sensorId);
    }
  }

  showConfirm(): void {
    this.formAssignment.markAllAsTouched();

    if (this.formAssignment.invalid) {
      this.uiUtilsService.warning('Llene los campos obligatorios.');

      return;
    }

    const action = this.isEditMode ? 'actualizar' : 'registrar';

    this.confirmService.confirm(
      async () => {
        const formValue = this.formAssignment.getRawValue();

        const payload = {
          ...formValue,

          vehicle_id: formValue.vehicle_id?.id,

          device_id: formValue.device_id?.id,

          sensors: this.getSensorSelected(),
        };

        if (this.isEditMode) {
          await this.updateAssignment(payload);
        } else {
          await this.saveAssignment(payload);
        }
      },

      {
        title: this.isEditMode ? 'Actualizar asignación' : 'Registrar asignación',

        content: `¿Está seguro de que desea ${action} la asignación del dispositivo?`,

        danger: false,
      },
    );
  }

  getSensorSelected() {
    return this.arrayEvents.map((sensorId) => ({
      sensor_id: sensorId,
    }));
  }

  saveAssignment(data: any): void {
    this.deviceVehicleService.register(data).subscribe({
      next: () => {
        this.uiUtilsService.success('Se registró correctamente la asignación.');

        setTimeout(() => {
          this.router.navigate(['/list-assignments']);
        }, 1000);
      },

      error: () => {
        this.uiUtilsService.error('Error al registrar la asignación del dispositivo-vehículo.');
      },
    });
  }

  updateAssignment(data: any): void {
    if (!this.deviceVehicleId) {
      return;
    }

    this.deviceVehicleService.update(data, this.deviceVehicleId).subscribe({
      next: () => {
        this.uiUtilsService.success('Se actualizó correctamente la asignación.');

        setTimeout(() => {
          this.router.navigate(['/list-assignments']);
        }, 1000);
      },

      error: () => {
        this.uiUtilsService.error('Error al actualizar la asignación.');
      },
    });
  }

  getDeviceVehicle(id: string): void {
    this.deviceVehicleService.find(id).subscribe({
      next: (response) => {
        const data = this.utilsService
          .getResponseGeneral(response)
          .find((element: any) => element?.id === id);

        if (!data) {
          return;
        }

        let vehicle = data.vehicle;

        try {
          vehicle = {
            ...vehicle,

            metadata:
              typeof vehicle.metadata === 'string'
                ? JSON.parse(vehicle.metadata)
                : vehicle.metadata,
          };
        } catch {}

        const fullVehicle = this.arrayVehicles.find((vehicleItem) => vehicleItem.id === vehicle.id);

        const fullDevice = this.arrayDevices.find((device) => device.id === data.device_id);

        this.formAssignment.patchValue({
          vehicle_id: fullVehicle ?? vehicle,

          device_id: fullDevice ?? data.device,

          observations: data.observations,

          create_date: data.create_date ? new Date(data.create_date) : null,

          install_date: data.install_date ? new Date(data.install_date) : null,
        });

        if (fullDevice?.gpsspec?.id) {
          this.getSensorByDevice(fullDevice.gpsspec.id);
        }

        if (Array.isArray(data.sensors)) {
          this.arrayEvents = data.sensors.map((sensor: any) => sensor.sensor_id);
        }
      },

      error: () => {
        this.uiUtilsService.error('Error al cargar los datos.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/list-assignments']);
  }
}
