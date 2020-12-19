// https://medium.com/@OlegVaraksin/how-to-make-ionic-storage-reactive-acdd8996f1e6

import { CoreState } from './core.state';
import { Store } from './abstract.store';
import { Injectable } from '@angular/core';

//https://capacitorjs.com/docs/guides/storage
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class CoreStore extends Store<CoreState> {

  private readonly _prefix: string;
  
  private readonly SURVEYS = 'surveys';

  public ready$: Promise<any[]>;

  constructor() {
    super(new CoreState());
    this._prefix = 'argosF360';

    // read initial values from storage
    this.ready$ = Promise.all([
      this.initValue(this.SURVEYS)
    ]);
  }

  public setSurveys(value: string): Promise<any> {
    return this.setValue(this.SURVEYS, value);
  }

  public readSurveys(): Promise<string> {
    return this.readValue(this.SURVEYS);
  }

  public removeSurveys(): Promise<any> {
    return this.removeValue(this.SURVEYS);
  }

  private initValue(prop: keyof CoreState): Promise<any> {
    const keyval = `${this._prefix}-${prop}`;
    return Storage.get({key:keyval}).then(value => {
      this.setStateValue(prop, value);
      return value;
    }).catch(_ => {
      this.setStateValue(prop, undefined);
      return undefined;
    });
  }

  private setValue(prop: keyof CoreState, value: any): Promise<any> {
    this.setStateValue(prop, value);
    const keyval = `${this._prefix}-${prop}`;
    return Storage.set({key: keyval,value: value});
  }

  private readValue(prop: keyof CoreState): Promise<any> {
    const keyval = `${this._prefix}-${prop}`;
    return Storage.get({key: keyval});
  }

  private removeValue(prop: keyof CoreState): Promise<any> {
    this.setStateValue(prop, undefined);
    const keyval = `${this._prefix}-${prop}`;
    return Storage.remove({key: keyval});
  }
  
  private setStateValue(prop: keyof CoreState, value: any): void {
    this.state = {
      ...this.state,
      [prop]: value
    };
  }
}