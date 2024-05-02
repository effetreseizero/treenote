import { Component, OnInit, Input } from '@angular/core';

import { 
  ModalController 
} from '@ionic/angular';


@Component({
  selector: 'app-coords-edit',
  templateUrl: './coords-edit.page.html',
  styleUrls: ['./coords-edit.page.scss'],
})
export class CoordsEditPage implements OnInit {

  isDisabled;

  latitude;
  longitude;
  altitude;
  accuracy;
  status;  

  constructor(
    private modalController: ModalController,
  ) {
    debugger;
  }

  ngOnInit() {
    debugger;
    this.isDisabled = this.status==="public"||this.status==="archive";
  }

  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  confirm() {
    this.modalController.dismiss(
      {
        latitude:this.latitude,
        longitude:this.longitude,
        altitude:this.altitude,
        accuracy:this.accuracy
      },
      'confirm'
    );
  }

}
