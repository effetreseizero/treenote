import { Component, OnInit } from '@angular/core';

import { PopoverController, } from '@ionic/angular';


import { UserOptionsService } from '../../services/options/user-options.service'

@Component({
  selector: 'app-survey-helper-popover',
  templateUrl: './survey-helper-popover.component.html',
  styleUrls: ['./survey-helper-popover.component.scss'],
})
export class SurveyHelperPopoverComponent implements OnInit {

  public hidehelper = false;

  constructor(
    private popoverController: PopoverController,
    private userOptionsService: UserOptionsService) { }

  ngOnInit() {}

  dismiss() {
    // code for dismiss
    if(this.hidehelper){
      this.userOptionsService.setSurveyHelper(false);
    }
    this.popoverController.dismiss();
  }

  changeToggle(){
    this.hidehelper = !this.hidehelper;
  }

}
