import { Component, OnInit } from '@angular/core';

// https://www.positronx.io/add-dynamic-side-menu-in-ionic-with-active-class/
import { Router, RouterEvent } from '@angular/router';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  activePath = '';

  pages = [
    {
      name: 'Home',
      path: '/menu/home'
    },
    {
      name: 'Surveys',
      path: '/menu/surveys'
    },
    {
      name: 'Export',
      path: '/menu/export'
    },
    {
      name: 'Contact',
      path: '/menu/contact'
    },
  ]

  constructor(private router: Router) {
    // https://www.positronx.io/add-dynamic-side-menu-in-ionic-with-active-class/
    this.router.events.subscribe((event: RouterEvent) => {
      this.activePath = event.url
    })
  }

  ngOnInit() {
  }

}
