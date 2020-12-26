import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CoreFacade} from '../../services/storage/core.facade';
import { Observable } from 'rxjs';

import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public formGroup: FormGroup;

  surveys: string[];

  constructor(public _fb: FormBuilder, private _cf: CoreFacade, private router: Router) {}

  ngOnInit() {
    console.log("homepage ngoninit");
    this.formGroup = this._fb.group({
      name:[''],
    })
    this._cf.getSurveys().subscribe((surveys)=>{
      this.surveys=surveys;
      console.log("homepage ngoninit: "+this.surveys);
    });
    
  }

  public formSubmit(): void {
    this._cf.addSurvey(this.formGroup.get('name').value);
    console.log("homepage formsubmit: "+this.surveys);
  }

  public logIn(): void{
    this.router.navigate(['/menu/login']);
  }

}


