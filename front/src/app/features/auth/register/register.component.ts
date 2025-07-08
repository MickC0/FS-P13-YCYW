import {
  ChangeDetectionStrategy,
  Component,
  signal
} from '@angular/core';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/service/auth.service';
import { MATERIAL_IMPORTS } from '../../../shared/material';
import { RegisterRequest } from '../../../core/models/register-request.model';
import {debounceTime, merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ...MATERIAL_IMPORTS,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required]);
  readonly confirmPassword = new FormControl('', [Validators.required]);
  readonly role = new FormControl('CLIENT', [Validators.required]);

  readonly emailError = signal('');
  readonly passwordError = signal('');
  readonly confirmError = signal('');
  readonly roleError = signal('');

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    merge(
      this.email.statusChanges,
      this.email.valueChanges,
      this.password.statusChanges,
      this.password.valueChanges,
      this.confirmPassword.statusChanges,
      this.confirmPassword.valueChanges,
    )
        .pipe(
            debounceTime(200),
            takeUntilDestroyed()
        )
      .subscribe(() => this.updateErrorMessages());
  }

  updateErrorMessages(): void {
    this.emailError.set(this.email.hasError('required') ? 'Email requis' :
      this.email.hasError('email') ? 'Email non valide' : '');

    this.passwordError.set(this.password.hasError('required') ? 'Mot de passe requis' : '');

    if (this.confirmPassword.hasError('required')) {
      this.confirmError.set('Confirmation requise');
    } else if (this.password.value !== this.confirmPassword.value) {
      this.confirmError.set('Les mots de passe ne correspondent pas');
      if (!this.confirmPassword.hasError('mismatch')) {
        this.confirmPassword.setErrors({ mismatch: true });
      }
    } else {
      this.confirmError.set('');
      if (this.confirmPassword.hasError('mismatch')) {
        const errors = { ...this.confirmPassword.errors };
        delete errors['mismatch'];
        this.confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
      }
    }


    this.roleError.set(this.role.hasError('required') ? 'Rôle requis' : '');
  }


  onSubmit(): void {
    this.email.markAsTouched();
    this.password.markAsTouched();
    this.confirmPassword.markAsTouched();
    this.role.markAsTouched();
    this.updateErrorMessages();

    if (
      this.email.invalid ||
      this.password.invalid ||
      this.confirmPassword.invalid ||
      this.role.invalid ||
      this.password.value !== this.confirmPassword.value
    ) return;

    const request: RegisterRequest = {
      email: this.email.value!,
      password: this.password.value!,
      confirmPassword: this.confirmPassword.value!,
      role: this.role.value! as 'CLIENT' | 'SAV'

    };

    this.auth.register(request).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => {
        this.snackbar.open('Erreur lors de l’inscription', 'Fermer', { duration: 3000 });
      }
    });

  }

}
