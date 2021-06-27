import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-home-helper',
  templateUrl: './home-helper.page.html',
  styleUrls: ['./home-helper.page.scss'],
})
export class HomeHelperPage implements OnInit {

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
