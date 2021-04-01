//https://edupala.com/ionic-popover-example/

import { Component, OnInit } from '@angular/core';
import { PopoverController, } from '@ionic/angular';

@Component({
  selector: 'app-helper-popover',
  templateUrl: './helper-popover.component.html',
  styleUrls: ['./helper-popover.component.scss'],
})
export class HelperPopoverComponent implements OnInit {
  message;

  constructor(
    private popoverController: PopoverController
  ) { }

  ngOnInit() {}

  dismiss() {
    // code for dismiss
    this.popoverController.dismiss();
  }

}
