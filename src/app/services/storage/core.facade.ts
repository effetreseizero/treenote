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

  public getUser(): Observable<string> {
    return this._store.select(x=>x.user);
  }

  public setUser(user:string): void{
    this._store.readUser().then((user)=>{
      //manage initial missing array (no key on Storage)
      if(user==null){
        user = "";
      }
      this._store.setUser(user)
        .finally(() => console.log("corefacade: "+this._store.state.user));
    });
    
  }

}