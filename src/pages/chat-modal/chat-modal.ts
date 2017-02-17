import { UserService } from './../../providers/user-service';
import { User } from './../../models/user.model';
import { Message } from './../../models/message.model';
import { ChannelService } from './../../providers/channel-service';
import { Channel } from './../../models/channel.model';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Content } from 'ionic-angular';

/*
  Generated class for the ChatModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-chat-modal',
  templateUrl: 'chat-modal.html',
  providers: [ChannelService, UserService]
})

export class ChatModalPage {
  @ViewChild(Content) content: Content;

  channel: Channel;
  messages: Message[];
  localUser: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private channelService: ChannelService, private userService: UserService) {
    this.channel = navParams.get('channel');
    
    this.localUser = new User(0, "", "", "");

    this.userService.getLocalUser()
      .then((user: User) => this.localUser = user);

    this.channelService.getChannelMessages(this.channel)
      .then((messages: Message[]) => {
        this.messages = messages;
        //setTimeout(() =>  this.content.scrollToBottom(), 1000);
      });
  }

  close(){
    this.viewCtrl.dismiss();
  }

  loadMedia(media: string) {
    let msg = media;

    if (media.slice(0, 4) == "<img")
    {

      let src = media.split('src="')[1];
      src = src.slice(0, src.indexOf('"'));

      msg = '<ion-img width="80" height="80" src="'+src+'"></ion-img>';
    }

    return msg;
  }

  isMedia(text: string){
    if (text.slice(0, 4) == "<img") return true;
    else return false;
  }

  catchMediaSource(text: string){
    let src = "";

    if (this.isMedia(text))
    {
      src = text.split('src="')[1];
      src = src.slice(0, src.indexOf('"'));
    }

    return src;
  }

  sendMessage(){

  }

}