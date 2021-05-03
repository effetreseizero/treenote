import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate(): boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate): boolean {
    /*
    The return value would be true, unless the canActivate function, 
    defined on the component returns false,
    in which case the function will open a Dialog Box,
    to ask if we want to stay on the page or leave the page.
    */
    return component.canDeactivate();

  }
}
