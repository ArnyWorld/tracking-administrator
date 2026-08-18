import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmOptions } from '../../models/confirmOptions.interface';
import { ConfirmDialogComponent } from '../../../shared/confirm-modal/confirm-modal';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  private readonly dialog = inject(MatDialog);

  confirm(onOk: () => void | Promise<void>, options?: ConfirmOptions): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      maxWidth: 'calc(100vw - 32px)',
      disableClose: true,
      data: {
        title: options?.title ?? '¿Estás seguro?',

        content: options?.content ?? 'Esta acción no se puede deshacer.',

        okText: options?.okText ?? 'Aceptar',

        cancelText: options?.cancelText ?? 'Cancelar',

        danger: options?.danger ?? true,
      },
    });

    dialogRef.afterClosed().subscribe(async (confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      await onOk();
    });
  }
}
