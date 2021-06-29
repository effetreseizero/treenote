//https://edupala.com/ionic-popover-example/

import { Component, OnInit } from '@angular/core';
import { PopoverController, } from '@ionic/angular';


import { UserOptionsService } from '../../services/options/user-options.service'

@Component({
  selector: 'app-helper-popover',
  templateUrl: './helper-popover.component.html',
  styleUrls: ['./helper-popover.component.scss'],
})
export class HelperPopoverComponent implements OnInit {
  message;

  public hidehelper = false;

  constructor(
    private popoverController: PopoverController,
    private userOptionsService: UserOptionsService
  ) { }

  ngOnInit() {}

  dismiss() {
    // code for dismiss
    if(this.hidehelper){
      this.userOptionsService.setHomeHelper(true);
    }
    this.popoverController.dismiss();
  }

  changeToggle(){
    this.hidehelper = !this.hidehelper;
  }

}
