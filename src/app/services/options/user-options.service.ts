import { Injectable } from '@angular/core';

import { CoreState } from './core.state';
import { Store } from './abstract.store';

//https://capacitorjs.com/docs/guides/storage
import { Storage } from '@capacitor/storage';


@Injectable({
  providedIn: 'root'
})
export class UserOptionsService extends Store<CoreState> {

  private readonly _prefix: string;
  private readonly HOME_HELPER = 'homeHelper';
  private readonly SURVEY_HELPER = 'surveyHelper';
  public ready$: Promise<any[]>;

  constructor(

  ) 
  {
      super(new CoreState());
      
      this._prefix = 'treenoteapp';

      // read initial values from storage
      this.ready$ = Promise.all([
        this.initValue(this.HOME_HELPER),
        this.initValue(this.SURVEY_HELPER),
      ]);
  }

  public setHomeHelper(value: boolean): Promise<any> {
    return this.setValue(this.HOME_HELPER, value);
  }

  public readHomeHelper(): Promise<any> {
    return this.readValue(this.HOME_HELPER);
  }


  public setSurveyHelper(value: boolean): Promise<any> {
    return this.setValue(this.SURVEY_HELPER, value);
  }

  public readSurveyHelper(): Promise<any> {
    return this.readValue(this.SURVEY_HELPER);
  }

  private initValue(prop: keyof CoreState): Promise<any> {
    const key = `${this._prefix}-${prop}`;
    return Storage.get({key:key}).then(value => {
      this.setStateValue(prop, value);
      return value;
    }).catch(_ => {
      this.setStateValue(prop, undefined);
      return undefined;
    });
  }

  private setValue(prop: keyof CoreState, value: any): Promise<any> {
    this.setStateValue(prop, value);
    const key = `${this._prefix}-${prop}`;
    return Storage.set({key: key, value});
  }

  private readValue(prop: keyof CoreState): Promise<any> {
    const key = `${this._prefix}-${prop}`;
    return Storage.get({key:key});
  }

  private removeValue(prop: keyof CoreState): Promise<any> {
    this.setStateValue(prop, undefined);
    const key = `${this._prefix}-${prop}`;
    return Storage.remove({key:key});
  }
  
  private setStateValue(prop: keyof CoreState, value: any): void {
    this.state = {
      ...this.state,
      [prop]: value
    };
  }
}
