import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  private readonly authService = inject(AuthService);
  usersMenuOpen: boolean = true;
  usersMenuOpen2: boolean = true;
  usersMenuOpen3: boolean = true;
  readonly currentUser = this.authService.getCurrentUser();

  companySelected = localStorage.getItem('company')
    ? JSON.parse(localStorage.getItem('company')!)
    : null;

  logout(): void {
    this.authService.logout();
  }

  getCompanyInitials(name?: string | null): string {
    if (!name?.trim()) {
      return '?';
    }

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase();
  }
}
