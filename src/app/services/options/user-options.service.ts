import { Injectable } from '@angular/core';

import { CoreState } from './core.state';
import { Store } from './abstract.store';

//https://capacitorjs.com/docs/guides/storage
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class UserOptionsService extends Store<CoreState> {

  private readonly _prefix: string;
  private readonly HIDE_HELPER = 'hideHelper';
  private readonly DARK_MODE = 'darkMode';
  public ready$: Promise<any[]>;

  constructor(

  ) 
  {
      super(new CoreState());
      
      this._prefix = 'treenoteapp';

      // read initial values from storage
      this.ready$ = Promise.all([
        this.initValue(this.HIDE_HELPER),
        this.initValue(this.DARK_MODE),
      ]);
  }

  public setHideHelper(value: boolean): Promise<any> {
    return this.setValue(this.HIDE_HELPER, value);
  }

  public readHideHelper(): Promise<any> {
    return this.readValue(this.HIDE_HELPER);
  }


  public setDarkMode(value: boolean): Promise<any> {
    return this.setValue(this.DARK_MODE, value);
  }

  public readDarkMode(): Promise<any> {
    return this.readValue(this.DARK_MODE);
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
