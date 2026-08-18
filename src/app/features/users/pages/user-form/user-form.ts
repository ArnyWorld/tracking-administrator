import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { CreateUserComponent } from '../../components/create-user/create-user';
import CreateCompanyComponent from '../../components/create-company/create-company';

@Component({
  selector: 'app-user-form',
  imports: [MatButtonModule, MatStepperModule, CreateUserComponent, CreateCompanyComponent],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  readonly current = signal(0);

  next(): void {
    this.current.update((value) => value + 1);
  }

  previous(): void {
    this.current.update((value) => Math.max(0, value - 1));
  }

  finish(): void {
    console.log('Proceso finalizado');
  }
}
