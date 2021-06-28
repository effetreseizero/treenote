import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-new-survey-helper',
  templateUrl: './new-survey-helper.page.html',
  styleUrls: ['./new-survey-helper.page.scss'],
})
export class NewSurveyHelperPage implements OnInit {

  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss();
  }
}
