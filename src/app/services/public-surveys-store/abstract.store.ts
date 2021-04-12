//https://medium.com/@OlegVaraksin/how-to-make-ionic-storage-reactive-acdd8996f1e6
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export abstract class Store<T> {

  private _state$: BehaviorSubject<T>;

  protected constructor(initialState: T) {
    this._state$ = new BehaviorSubject(initialState);
  }

  public get state(): T {
    return this._state$.getValue();
  }

  public set state(nextState: T) {
    this._state$.next(nextState);
  }

}