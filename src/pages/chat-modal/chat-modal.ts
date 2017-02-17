import { UserService } from './../../providers/user-service';
import { User } from './../../models/user.model';
import { Message } from './../../models/message.model';
import { ChannelService } from './../../providers/channel-service';
import { Channel } from './../../models/channel.model';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the ChatModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-chat-modal',
  templateUrl: 'chat-modal.html',
  providers: [ChannelService,UserService]
})
export class ChatModalPage {

  channel: Channel;
  messages: Message[];
  localUser: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private channelService: ChannelService, private userService: UserService) {
    this.channel = navParams.get('channel');
    
    this.localUser = new User(0, "", "", "");

    this.userService.getLocalUser()
      .then((user: User) => this.localUser = user);

    this.channelService.getChannelMessages(this.channel)
      .then((messages: Message[]) => this.messages = messages);
  }

  close(){
    this.viewCtrl.dismiss();
  }

}
