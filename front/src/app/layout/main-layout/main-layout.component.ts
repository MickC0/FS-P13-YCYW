import { Component } from '@angular/core';
import {MATERIAL_IMPORTS} from '../../shared/material';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-main-layout.component',
  imports: [
    ...MATERIAL_IMPORTS,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
