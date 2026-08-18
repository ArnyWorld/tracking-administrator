import { TemplateRef } from '@angular/core';

export interface DataTableColumn<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  template?: any;
}
