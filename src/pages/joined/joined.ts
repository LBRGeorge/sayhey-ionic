import { ChatModalPage } from './../chat-modal/chat-modal';
import { UserService } from './../../providers/user-service';
import { Channel } from './../../models/channel.model';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserChannels()
      .then((channels: Channel[]) => this.channels = channels);
  }

  openChat(channel: Channel): void{
    let modal = this.modalCtrl.create(ChatModalPage, {channel: channel});

    modal.present();
  }

}
