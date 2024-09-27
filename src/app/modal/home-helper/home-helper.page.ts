import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { Router } from '@angular/router';


@Component({
  selector: 'app-home-helper',
  templateUrl: './home-helper.page.html',
  styleUrls: ['./home-helper.page.scss'],
})
export class HomeHelperPage implements OnInit {

  constructor(
    public modalCtrl: ModalController,
    public router:Router
  ) { }

  ngOnInit() {
  }

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss();
  }

  public logIn(): void{
    this.router.navigate(['/login']);
    this.dismissModal();
  }
}
