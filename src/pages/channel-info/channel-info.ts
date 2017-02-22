import { Channel } from './../../models/channel.model';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the ChannelInfo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-channel-info',
  templateUrl: 'channel-info.html'
})
export class ChannelInfoPage {

  channel: Channel;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.channel = navParams.get('channel');
  }
  
  close() {
    this.viewCtrl.dismiss();
  }
}
