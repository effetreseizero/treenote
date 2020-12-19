import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CoreFacade} from '../core.facade';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public formGroup: FormGroup;

  surveys: string;

  constructor(public _fb: FormBuilder, private _facade: CoreFacade) {}

  ngOnInit() {
    this.formGroup = this._fb.group({
      name:[''],
    })
    this.surveys = this._facade.getSurveys();
  }

  public formSubmit(): void {
    this._facade.addSurvey(this.formGroup.get('name').value);
  }

}


