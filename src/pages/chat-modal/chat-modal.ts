import { SocketService } from './../../providers/socket.service';
import { UserService } from './../../providers/user-service';
import { User } from './../../models/user.model';
import { Message } from './../../models/message.model';
import { ChannelService } from './../../providers/channel-service';
import { Channel } from './../../models/channel.model';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Content } from 'ionic-angular';

import { LocalNotifications } from 'ionic-native';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private channelService: ChannelService, private userService: UserService, public socketService: SocketService) {
    this.channel = navParams.get('channel');
    //this.socketService.get();
    
    this.localUser = new User(0, "", "", "");

    //Get local user
    this.userService.getLocalUser()
      .then((user: User) => this.localUser = user);

    //Get channel messages
    this.channelService.getChannelMessages(this.channel)
      .then((messages: Message[]) => {
        this.messages = messages;
        setTimeout(() =>  this.content.scrollToBottom(), 200);
      });

     this.socketService.getOnlineUsers(this.channel.ID);

     this.socketService.socket.on("userGroupMessage", (message) => this.onGroupMessageReceive(message));
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

  identify(index, item) {
    return item.ID;
  }

  sendMessage(txtChat){
    //console.log("> MSG: " + txtChat.value);
    let msg = txtChat.value;
    txtChat.value = '';
    
    var date = new Date();
    
    let message = new Message(
      date.getMilliseconds(),
      this.localUser.ID,
      this.localUser.Username,
      msg,
      date.toString(),
      false
    );

    this.messages.push(message);

    this.socketService.sendGroupMessage(this.localUser, this.channel.ID, msg, date.getMilliseconds());
    setTimeout(() =>  this.content.scrollToBottom(), 200);
  }

  isLastMessageMine(msg: Message): boolean {

    if (this.messages.length > 0)
    {
      let index: number = 0;

      for(let _msg of this.messages)
      {
        if (_msg.ID == msg.ID) break;
        else index++;
      }

      if (index > 0)
      {
        let prev_msg = this.messages[index-1];

        if (prev_msg.UserID == msg.UserID) return true;
      }
    }

    return false;
  }

  //EVENTS
  private onGroupMessageReceive(message){

    //Self message
    if (message.UserID == this.localUser.ID)
    {
        let msg = this.messages.find(m => m.ID == message.ContentID);

        if (msg != undefined)
        {
          msg.ID = message.MessageID;
          msg.Sent = true;
        }
    }
    else {

      let msg = new Message(
        message.MessageID,
        message.UserID,
        message.Username,
        message.Message,
        message.Date
      );

      this.messages.push(msg);

      setTimeout(() =>  this.content.scrollToBottom(), 200);

      // Schedule a single notification
      LocalNotifications.schedule({
        id: msg.ID,
        title: 'SayHey!',
        text: this.channel + "@ " + msg.Username + ": " + msg.Text,
        led: "0xff00ff00"
      });

    }
  }
}