import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly appName = 'Kiro-Version-Iteration';

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly routeTitle = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.activatedRoute.firstChild?.snapshot.title ?? '')
    ),
    { initialValue: this.activatedRoute.firstChild?.snapshot.title ?? '' }
  );
}
