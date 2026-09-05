import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { DeviceService } from '../../services/device/device.service';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { UiUtilsService } from '../../../../core/services/utils/ui-utils.service';
import { Router } from '@angular/router';
import { ConfirmService } from '../../../../core/services/confirm/confirm.service';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GpsSensorService } from '../../services/gps-sensor/gps-sensor.service';
import { GpsspecsService } from '../../services/gpsspecs/gpsspecs.service.service';

@Component({
  selector: 'app-device-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './device-form.html',
  styleUrl: './device-form.css',
})
export class DeviceForm implements OnInit {
  private fb = inject(FormBuilder);
  private gpsSpecsService = inject(GpsspecsService);
  private deviceService = inject(DeviceService);
  private utilsService = inject(UtilsService);
  private messageService = inject(UiUtilsService);
  private router = inject(Router);
  private confirmService = inject(ConfirmService);
  private destroyRef = inject(DestroyRef);

  private searchDevice$ = new Subject<string>();

  formDevice: FormGroup;

  action = 'Registro de';

  arrayGpsspecs: any[] = [];
  arrayDevices: any[] = [];

  isLoadingSpecs = signal(false);
  isLoadingDevices = signal(false);

  constructor() {
    this.formDevice = this.fb.group({
      info_brand: [null, Validators.required],
      info_model: [null, Validators.required],
      imei: [null, Validators.required],
      phone_number: [null, Validators.required],
      gpsspec_id: [null, Validators.required],
      id: [null, Validators.required],

      registred: [true],
      registred_date: [new Date()],
    });

    this.getGpsSpecs();
  }

  ngOnInit(): void {
    this.configureDeviceSearch();
    this.onChangeDeviceId();
  }

  private configureDeviceSearch(): void {
    this.searchDevice$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((text) => text.trim().length >= 4),
        tap(() => {
          this.isLoadingDevices.set(true);
        }),

        switchMap((imei) => this.deviceService.findDeviceByImei(imei)),

        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (data) => {
          this.arrayDevices = data.filter((gps: any) => gps.imei !== 'undefined');

          this.isLoadingDevices.set(false);
        },

        error: () => {
          this.arrayDevices = [];
          this.isLoadingDevices.set(false);

          this.messageService.error('No se pudieron recuperar los dispositivos.');
        },
      });
  }

  onSearch(value: string): void {
    const search = value.trim();

    if (search.length < 4) {
      this.arrayDevices = [];
      this.isLoadingDevices.set(false);
      return;
    }

    this.searchDevice$.next(search);
  }

  private onChangeDeviceId(): void {
    this.formDevice
      .get('id')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (!value) {
          this.formDevice.patchValue({
            info_brand: null,
            info_model: null,
            gpsspec_id: null,
            imei: null,
          });

          return;
        }

        const device = this.arrayDevices.find((deviceFind) => deviceFind.id === value);

        if (!device) {
          return;
        }

        this.formDevice.patchValue({
          info_brand: device.brand ?? null,
          info_model: device.model ?? null,
          gpsspec_id: device.gpsspec_id ?? null,
          imei: device.imei ?? null,
        });
      });
  }

  private getGpsSpecs(): void {
    this.isLoadingSpecs.set(true);

    this.gpsSpecsService.getAll().subscribe({
      next: (data) => {
        this.arrayGpsspecs = this.utilsService.getResponseGeneral(data) ?? [];

        this.isLoadingSpecs.set(false);
      },

      error: () => {
        this.isLoadingSpecs.set(false);

        this.messageService.error('No se pudieron recuperar las especificaciones.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/app/assignment/list']);
  }

  showConfirm(): void {
    if (this.formDevice.invalid) {
      this.formDevice.markAllAsTouched();

      this.messageService.warning('Llene los campos obligatorios.');

      return;
    }

    this.confirmService.confirm(
      async () => {
        this.saveDevice();
      },
      {
        title: 'Registrar dispositivo',

        content: `
          ¿Estás seguro de que desea registrar el dispositivo
          con IMEI: ${this.formDevice.value.imei}?
        `,

        danger: false,
      },
    );
  }

  private saveDevice(): void {
    if (this.formDevice.invalid) {
      this.formDevice.markAllAsTouched();
      return;
    }

    this.deviceService.register(this.formDevice.value).subscribe({
      next: () => {
        this.messageService.success('Se registró correctamente el dispositivo.');

        this.router.navigate(['/list-devices']);
      },

      error: () => {
        this.messageService.error('No se pudo registrar el dispositivo.');
      },
    });
  }
}
