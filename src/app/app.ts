import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { Header } from './core/components/layout/header/header';
import { getTrainees } from './features/data/store/trainees.actions';
import { DataFiltersQueryParams } from './features/data/interfaces/data-filters-query-params.interface';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  route = inject(ActivatedRoute);
  store = inject(Store);

  protected readonly title = signal('biks');

  ngOnInit(): void {
    this.store.dispatch(getTrainees({ queryParams: this.route.snapshot.queryParams as DataFiltersQueryParams }));
  }
}
