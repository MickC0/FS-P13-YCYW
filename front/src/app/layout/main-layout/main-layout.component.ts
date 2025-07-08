import {Component, computed, inject} from '@angular/core';
import {MATERIAL_IMPORTS} from '../../shared/material';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from '../../core/service/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [
    ...MATERIAL_IMPORTS,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  readonly isLogged = this.auth.isLoggedSignal;
  readonly userEmail = this.auth.email;
  readonly userRole = this.auth.role;

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
