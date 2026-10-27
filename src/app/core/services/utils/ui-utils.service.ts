import { inject, Injectable, Service } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UiMessageType } from '../../models/uimessage.interface';

@Injectable({
  providedIn: 'root',
})
export class UiUtilsService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  private show(message: string, type: UiMessageType, duration: number = 4500): void {
    this.snackBar.open(message, 'Cerrar', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: [`app-snackbar-${type}`],
    });
  }
}
