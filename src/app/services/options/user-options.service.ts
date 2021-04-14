import { Injectable } from '@angular/core';

import { CoreState } from './core.state';
import { CoreStore } from './core.store';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserOptionsService {

  constructor(
    private _store: CoreStore, 
  ) { 
    
  }

  public getShowHomeGuide(): boolean {
    return this._store.state.showHomeGuide;
  }

  public getDarkMode(): boolean {
    return this._store.state.darkMode;
  }
}
