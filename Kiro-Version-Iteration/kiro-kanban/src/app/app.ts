import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './adapters/components/header/header.component';
import { SidebarComponent } from './adapters/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
