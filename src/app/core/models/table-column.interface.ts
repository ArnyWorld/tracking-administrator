import { TemplateRef } from '@angular/core';
import { DataTableCellContext } from '../../shared/data-table/data-table';

export interface DataTableColumn<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  typeField?: 'text' | 'number' | 'date' | 'image' | 'color' | 'badge' | 'custom';
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  template?: any;
  value?: (row: T) => unknown;
}
