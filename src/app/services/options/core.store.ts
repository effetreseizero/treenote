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
  private readonly SHOW_HOME_GUIDE = 'showHomeGuide';
  private readonly DARK_MODE = 'darkMode';
  public ready$: Promise<any[]>;

  constructor(private _storage: Storage) {
    super(new CoreState());
    this._prefix = 'treenoteapp';

    // read initial values from storage
    this.ready$ = Promise.all([
      this.initValue(this.SHOW_HOME_GUIDE),
      this.initValue(this.DARK_MODE),
    ]);
  }

  public setShowHomeGuide(value: string): Promise<any> {
    return this.setValue(this.SHOW_HOME_GUIDE, value);
  }

  public readShowHomeGuide(): Promise<string> {
    return this.readValue(this.SHOW_HOME_GUIDE);
  }


  public setDarkMode(value: string): Promise<any> {
    return this.setValue(this.DARK_MODE, value);
  }

  public readDarkMode(): Promise<string> {
    return this.readValue(this.DARK_MODE);
  }



  private initValue(prop: keyof CoreState): Promise<any> {
    const key = `${this._prefix}-${prop}`;
    return this._storage.get(key).then(value => {
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
    return this._storage.set(key, value);
  }

  private readValue(prop: keyof CoreState): Promise<any> {
    const key = `${this._prefix}-${prop}`;
    return this._storage.get(key);
  }

  private removeValue(prop: keyof CoreState): Promise<any> {
    this.setStateValue(prop, undefined);
    const key = `${this._prefix}-${prop}`;
    return this._storage.remove(key);
  }
  
  private setStateValue(prop: keyof CoreState, value: any): void {
    this.state = {
      ...this.state,
      [prop]: value
    };
  }
}

/*

@Injectable({
  providedIn: 'root'
})
export class CoreStore extends Store<CoreState> {

  private readonly _prefix: string;
  
  private readonly USER = 'user';
  private readonly USER_INIT = null;
  public ready$: Promise<any[]>;

  constructor() {
    super(new CoreState());
    this._prefix = 'treenote';

    // read initial values from storage
    this.ready$ = Promise.all([
      this.initValue(this.USER)
    ]);
  }

  public getUser(): Promise<User> {
    return this.readValue(this.USER);
  }

  public setUser(value: User): Promise<any> {
    return this.setValue(this.USER, value);
  }

  public removeUser(): Promise<any> {
    return this.removeValue(this.USER);
  }

  private initValue(prop: keyof CoreState): Promise<any> {
  
    const keyval = `${this._prefix}-${prop}`;
    return Storage.get({key:keyval}).then(record => {
      //record.value poichè leggo dallo Storage
      this.setStateValue(prop, JSON.parse(record.value));
      return record;
    }).catch(_ => {
      this.setStateValue(prop, undefined);
      return undefined;
    });
  }

  private setValue(prop: keyof CoreState, value: any): Promise<any> {
    //solo value perchè arriva da form
    this.setStateValue(prop, value);
    const keyval = `${this._prefix}-${prop}`;
    return Storage.set({key: keyval,value: JSON.stringify(value)});
  }

  private readValue(prop: keyof CoreState): Promise<any> {
    const keyval = `${this._prefix}-${prop}`;
    return Storage.get({key: keyval}).then((record)=>{
      debugger;
      return JSON.parse(record.value);
    });
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

*/