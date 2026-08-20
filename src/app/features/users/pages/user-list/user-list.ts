import { AfterViewInit, Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UiUtilsService } from '../../../../core/services/utils/ui-utils.service';
import { User } from '../../models/userResponse.interface';
import { DataTableColumn } from '../../../../core/models/table-column.interface';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '../../../../shared/data-table/data-table';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-user-list',
  imports: [
    RouterLink,
    DataTableComponent,
    MatIconModule,
    MatBadgeModule,
    CommonModule,
    MatBadgeModule,
    MatButtonModule,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements AfterViewInit {
  private userService = inject(UserService);
  private uiUtils = inject(UiUtilsService);
  @ViewChild('companyTemplate')
  companyTemplate!: TemplateRef<unknown>;
  @ViewChild('dateTemplate')
  dateTemplate!: TemplateRef<unknown>;
  @ViewChild('typeTemplate')
  typeTemplate!: TemplateRef<unknown>;

  users = signal<User[]>([]);
  loading = signal(false);

  columns: DataTableColumn<User>[] = [];

  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit(): void {
    this.columns = [
      {
        key: 'name',
        label: 'Nombre',
        typeField: 'text',
        sortable: true,
        value: (user) => `${user.name} ${user.lastname}`,
      },

      {
        key: 'email',
        label: 'Correo electrónico',
        typeField: 'text',
        sortable: true,
      },

      {
        key: 'phone',
        label: 'Teléfono',
        typeField: 'text',
        value: (user) => user.phone ?? 'Sin teléfono',
      },

      {
        key: 'username',
        label: 'Usuario',
        typeField: 'text',
        sortable: true,
      },

      {
        key: 'type',
        label: 'Tipo',
        template: this.typeTemplate,
      },

      {
        key: 'enterprises',
        label: 'Empresas',
        template: this.companyTemplate,
      },

      {
        key: 'create_at',
        label: 'Registro',
        template: this.dateTemplate,
      },
    ];
  }

  getUsers(): void {
    this.loading.set(true);

    this.userService.getAllPaginate(0, 10).subscribe({
      next: (response) => {
        this.users.set(response.content ?? []);
        this.loading.set(false);
      },

      error: () => {
        this.loading.set(false);

        this.uiUtils.error('No se pudieron recuperar los usuarios registrados.');
      },
    });
  }

  reload(): void {
    this.getUsers();
  }

  edit(user: User): void {
    console.log('Editar usuario:', user);

    // posteriormente:
    // this.router.navigate(['/app/users/edit', user.id]);
  }

  delete(user: User): void {
    console.log('Eliminar usuario:', user);

    // posteriormente:
    // this.confirmService.confirm(...)
  }
}
