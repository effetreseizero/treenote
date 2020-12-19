// https://medium.com/@OlegVaraksin/how-to-make-ionic-storage-reactive-acdd8996f1e6

import { CoreState } from './core.state';
import { CoreStore } from './core.store';

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CoreFacade {
    
  constructor(private _store: CoreStore) { }

  public getSurveys(): string {
    return this._store.state.surveys;
  }

  public addSurvey(survey:string): void{
    this._store.readSurveys().then(surveys => {
      console.log(surveys);
      this._store.setSurveys(survey)
        .finally(() => console.log('survey added'));
    });
  }

}