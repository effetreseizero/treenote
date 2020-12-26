// https://medium.com/@OlegVaraksin/how-to-make-ionic-storage-reactive-acdd8996f1e6

import { CoreState } from './core.state';
import { CoreStore } from './core.store';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CoreFacade {
    
  constructor(private _store: CoreStore) { }

  public getSurveys(): Observable<string[]> {
    return this._store.select(x=>x.surveys);
  }

  public addSurvey(survey:string): void{
    this._store.readSurveys().then((surveys)=>{
      //manage initial missing array (no key on Storage)
      if(surveys==null){
        surveys = [];
      }
      surveys.push(survey);
      this._store.setSurveys(surveys)
        .finally(() => console.log("corefacade: "+this._store.state.surveys));
    });
    
  }

}