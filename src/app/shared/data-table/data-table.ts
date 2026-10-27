import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';

import { MatTooltipModule } from '@angular/material/tooltip';

export interface DataTableColumn<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;

  template?: TemplateRef<DataTableCellContext<T>> | any;

  typeField?: 'text' | 'number' | 'date' | 'image' | 'color' | 'badge' | 'custom';

  value?: (row: T) => unknown;
}

export interface DataTableCellContext<T> {
  $implicit: T;
  row: T;
  value: unknown;
}

export interface DataTableAction<T> {
  action: string;
  row: T;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './data-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T> {
  @Input() data: T[] = [];

  @Input() columns: DataTableColumn<T>[] = [];

  @Input() loading = false;

  @Input() total = 0;

  @Input() pageIndex = 0;

  @Input() pageSize = 10;

  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];

  @Input() emptyMessage = 'No hay registros para mostrar.';

  @Input() showPaginator = true;

  @Input() clickableRows = false;

  @Input() showActions = false;

  @Input() showEditAction = false;

  @Input() showDeleteAction = false;

  @Output() pageChange = new EventEmitter<PageEvent>();

  @Output() rowClick = new EventEmitter<T>();

  @Output() action = new EventEmitter<DataTableAction<T>>();

  @Output() edit = new EventEmitter<T>();

  @Output() delete = new EventEmitter<T>();

  @Input() showUserAction = false;

  @Output() userAction = new EventEmitter<T>();

  readonly dataSource = new MatTableDataSource<T>();

  get displayedColumns(): string[] {
    const columns = this.columns.map((column) => column.key.toString());

    if (this.showActions && (this.showEditAction || this.showDeleteAction)) {
      columns.push('actions');
    }

    return columns;
  }

  ngOnChanges(): void {
    this.dataSource.data = this.data;
  }

  getValue(row: T, key: keyof T | string): unknown {
    const path = key.toString().split('.');

    let value: unknown = row;

    for (const property of path) {
      if (value === null || value === undefined || typeof value !== 'object') {
        return null;
      }

      value = (value as Record<string, unknown>)[property];
    }

    return value;
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  onRowClick(row: T): void {
    if (!this.clickableRows) {
      return;
    }

    this.rowClick.emit(row);
  }

  onAction(action: string, row: T): void {
    this.action.emit({
      action,
      row,
    });
  }
}
