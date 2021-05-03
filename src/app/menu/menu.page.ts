import { Component, OnInit } from '@angular/core';

// https://www.positronx.io/add-dynamic-side-menu-in-ionic-with-active-class/
import { Router, RouterEvent } from '@angular/router';

import {CoreFacade} from "../services/storage/core.facade"
import {User} from 'src/app/services/storage/user';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  activePath = '';

  user: User;

  pages = [
    {
      name: 'Home',
      path: '/menu/home'
    },
    {
      name: 'Segnalazioni',
      path: '/menu/surveys'
    },
    {
      name: 'Contattaci',
      path: '/menu/contact'
    }
  ]

  constructor(
      private router: Router,
      private coreFacade: CoreFacade
    ) {
    // https://www.positronx.io/add-dynamic-side-menu-in-ionic-with-active-class/
    this.router.events.subscribe((event: RouterEvent) => {
      this.activePath = event.url
    })
  }

  ngOnInit() {
    this.coreFacade.getUser().subscribe((user)=>{
      this.user=user;
      if(this.user==undefined){
        this.pages = this.pages.filter((page)=>{
          return page.name !="Manager";
        });
      }
      else if(this.user.isAdmin){
        this.pages.push({
          name: 'Manager',
          path: '/menu/surveys-manager'
        });
      }
    });
  }

}
