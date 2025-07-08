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
import {merge} from 'rxjs';
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
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessages());
  }

  updateErrorMessages(): void {
    this.emailError.set(this.email.hasError('required') ? 'Email requis' :
      this.email.hasError('email') ? 'Email non valide' : '');

    this.passwordError.set(this.password.hasError('required') ? 'Mot de passe requis' : '');

    this.confirmError.set(this.confirmPassword.hasError('required') ? 'Confirmation requise' :
      this.password.value !== this.confirmPassword.value ? 'Les mots de passe ne correspondent pas' : '');

    this.roleError.set(this.role.hasError('required') ? 'Rôle requis' : '');

  }

  onSubmit(): void {
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
      next: res => {
        this.auth.saveToken(res.token);
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.snackbar.open('Erreur lors de l’inscription', 'Fermer', { duration: 3000 });
      }
    });
  }

}
