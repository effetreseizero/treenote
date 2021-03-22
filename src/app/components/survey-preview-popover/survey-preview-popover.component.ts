//https://edupala.com/ionic-popover-example/
import { Component, OnInit } from '@angular/core';
import { PopoverController, } from '@ionic/angular';

@Component({
  selector: 'app-survey-preview-popover',
  templateUrl: './survey-preview-popover.component.html',
  styleUrls: ['./survey-preview-popover.component.scss'],
})
export class SurveyPreviewPopoverComponent implements OnInit {
  survey;

  constructor(
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    debugger;
  }

  dismiss() {
    // code for dismiss
    this.popoverController.dismiss();
  }
    
}
