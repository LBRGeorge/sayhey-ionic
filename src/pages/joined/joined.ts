import { ChatModalPage } from './../chat-modal/chat-modal';
import { UserService } from './../../providers/user-service';
import { Channel } from './../../models/channel.model';
import { LoginPage } from '../login/login';
import { PopOverUserInfoPage } from '../pop-over-user-info/pop-over-user-info';
import { Component, OnInit } from '@angular/core';
import { App, NavController, NavParams, ModalController, PopoverController } from 'ionic-angular';

/*
  Generated class for the Joined page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-joined',
  templateUrl: 'joined.html',
  providers: [UserService]
})
export class JoinedPage implements OnInit {

  channels: Channel[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private appCtrl: App, private modalCtrl: ModalController, private popoverCtrl: PopoverController, private userService: UserService) { }
  
  ngOnInit(): void {
    this.userService.getUserChannels()
      .then((channels: Channel[]) => this.channels = channels);
  }

  ionViewDidEnter() {
    this.userService.getUserChannels()
      .then((channels: Channel[]) => this.channels = channels);
  }

  presentPopover(ev) {

    let popover = this.popoverCtrl.create(PopOverUserInfoPage);

    popover.onDidDismiss(() => {
      let comp = popover.component as PopOverUserInfoPage;

      if (comp.result == true)
      {
        //this.appCtrl.getRootNav().setRoot(LoginPage);
      }
    });

    popover.present({
      ev: ev
    });
  }

  openChat(channel: Channel): void{
    /*let modal = this.modalCtrl.create(ChatModalPage, {channel: channel});

    modal.onDidDismiss(() => {
      this.userService.getUserChannels()
      .then((channels: Channel[]) => this.channels = channels);
    });
    
    modal.present();*/

    this.navCtrl.push(ChatModalPage, {channel: channel});
  }

}
