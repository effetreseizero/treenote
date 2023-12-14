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

  @Input() latitude;

  @Input() longitude;

  @Input() altitude;

  @Input() accuracy;

  @Input() status;  

  constructor(
    private modalController: ModalController,
  ) {

  }

  ngOnInit() {
    this.isDisabled = this.status==="public"||this.status==="archive"
  }

  async closeModal() {
    await this.modalController.dismiss(
      {
        latitude:this.latitude,
        longitude:this.longitude,
        altitude:this.altitude,
        accuracy:this.accuracy
      }
    );
  }

}
