import { ChannelsPage } from './../channels/channels';
import { JoinedPage } from './../joined/joined';
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tabRoot1: any;
  tabRoot2: any;

  constructor(public navCtrl: NavController) {
    this.tabRoot1 = JoinedPage;
    this.tabRoot2 = ChannelsPage;
  }

}
