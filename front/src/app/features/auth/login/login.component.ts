import {ChangeDetectionStrategy, Component, effect, signal} from '@angular/core';
import {Validators, ReactiveFormsModule, FormControl, FormsModule} from '@angular/forms';

import {Router, RouterLink} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MATERIAL_IMPORTS} from '../../../shared/material';
import {AuthService} from '../../../core/service/auth.service';
import {merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';



@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    ReactiveFormsModule,
    ...MATERIAL_IMPORTS,
    RouterLink,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required]);
  readonly emailError = signal('');
  readonly passwordError = signal('');

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
    ) {
    merge(
      this.email.statusChanges,
      this.email.valueChanges,
      this.password.statusChanges,
      this.password.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage(): void {
    if (this.email.hasError('required')) {
      this.emailError.set('L’email est requis');
    } else if (this.email.hasError('email')) {
      this.emailError.set('Email non valide');
    } else {
      this.emailError.set('');
    }

    if (this.password.hasError('required')) {
      this.passwordError.set('Le mot de passe est requis');
    } else {
      this.passwordError.set('');
    }
  }

  onSubmit(): void {
    if (this.email.invalid || this.password.invalid) return;

    this.auth.login({
      email: this.email.value!,
      password: this.password.value!
    }).subscribe({
      next: res => {
        this.auth.saveToken(res.token);
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.snackBar.open('Identifiants invalides', 'Fermer', { duration: 3000 });
      }
    });
  }
}
