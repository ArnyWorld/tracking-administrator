import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-company',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './no-company.html',
  styleUrl: './no-company.css',
})
export class NoCompany {
  private router = inject(Router);

  constructor() {}
  goHome(): void {
    this.router.navigate(['/app/home']);
  }
}
