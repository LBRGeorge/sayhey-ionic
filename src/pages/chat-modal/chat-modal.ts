import { ChannelInfoPage } from './../channel-info/channel-info';
import { SocketService } from './../../providers/socket.service';
import { UserService } from './../../providers/user-service';
import { User } from './../../models/user.model';
import { Message } from './../../models/message.model';
import { ChannelService } from './../../providers/channel-service';
import { Channel } from './../../models/channel.model';
import { PreviewMessage } from './../../models/preview-message.model';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { Content } from 'ionic-angular';

import { PhotoViewer } from 'ionic-native';

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

  typingTimer: any;
  typingUsers: PreviewMessage[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private modalCtrl: ModalController, private channelService: ChannelService, private userService: UserService, public socketService: SocketService) {
    this.channel = navParams.get('channel');

    //Get local user
    this.localUser = new User(0, "", "", "", "");
    this.userService.getLocalUser()
      .then((user: User) => this.localUser = user);

    //Get channel messages
    this.channelService.getChannelMessages(this.channel)
      .then((messages: Message[]) => {
        this.messages = messages;
        this.socketService.getOnlineUsers(this.channel.ID);
        setTimeout(() =>  this.content.scrollToBottom(), 200);
      });

     this.socketService.socket.on("userGroupMessage", (message) => this.onGroupMessageReceive(message));
     this.socketService.socket.on("onlineUsers", (list) => this.onUsersOnline(list));
     this.socketService.socket.on("userDisconnect", (data) => this.onUserDisconnect(data));
     this.socketService.socket.on("userConnect", (data) => this.onUserConnect(data));
     this.socketService.socket.on("userGroupTyping", (data) => this.onUserTyping(data));
  }


  ionViewDidLoad() {
    if (this.navCtrl.getActive() != undefined) console.log("> chat: " + this.navCtrl.getActive().name);
    this.displayTab(false);
  }

  ionViewWillLeave() {
    this.displayTab(true);
  }

  openInfo() {
    let modal = this.modalCtrl.create(ChannelInfoPage, {channel: this.channel});
    modal.present();

    //this.navCtrl.push(ChannelInfoPage, {channel: this.channel});
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
      this.localUser.Avatar,
      msg,
      date.toString(),
      false
    );

    this.messages.push(message);

    this.socketService.sendGroupMessage(this.localUser, this.channel.ID, msg, date.getMilliseconds());
    setTimeout(() =>  this.content.scrollToBottom(), 200);
  }

  userTyping(txtChat) {
    if (txtChat.value.length > 0)
    {
      if (this.typingTimer != undefined) clearTimeout(this.typingTimer);

      this.typingTimer = setTimeout(() => {
        this.socketService.userTyping(this.localUser, this.channel.ID, 0, txtChat.value);
      }, 5000);

      this.socketService.userTyping(this.localUser, this.channel.ID, 1, txtChat.value);
    }
  }

  showImage(image: string) {
    let dot = image.lastIndexOf('.');

    if (dot != -1)
    {
      let ext = image.slice(dot);

      console.log("> "+ext);
      if (ext == ".png" || ext == ".jpg" || ext == ".jpeg" || ext == ".bmp")
      {
        PhotoViewer.show(image);
      }
    }
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

  private displayTab(display:boolean) {
    let elements = document.querySelectorAll(".tabbar");

    if (elements != null) {
        Object.keys(elements).map((key) => {
            elements[key].style.display = display ? 'flex' : 'none';
        });
    }
  }

  //EVENTS
  private onGroupMessageReceive(message){
    console.log("Message received from: " + message.Username);

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
        message.UserAvatar,
        message.Message,
        message.Date
      );

      this.messages.push(msg);

      setTimeout(() => {
        if (this.content != null) this.content.scrollToBottom();
      }, 200);
    }
  }

  private onUsersOnline(list) {
    for(let msg of this.messages)
    {
      if (list.indexOf(msg.UserID) != -1)
      {
        msg.UserStatus = 1;
      }
    }
  }

  private onUserConnect(data) {
    if (this.messages != undefined)
    {
      for(let msg of this.messages)
      {
        if (msg.UserID == data.UserID && data.UserID != this.localUser.ID)
        {
          msg.UserStatus = 1;
        }
      }
    }
  }

  private onUserDisconnect(data) {
    if (this.messages != undefined)
    {
      for(let msg of this.messages)
      {
        if (msg.UserID == data.UserID)
        {
          msg.UserStatus = 0;
        }
      }
    }
  }

  private onUserTyping(data) {
    let msg = data as PreviewMessage;

    if (msg.GroupID == this.channel.ID && msg.UserID != this.localUser.ID)
    {
      let is_typing = this.typingUsers.find(p => p.UserID == msg.UserID);

      if (msg.Typing == 0 && is_typing != undefined)
      {
        let index = this.typingUsers.indexOf(msg);

        this.typingUsers.splice(index, 1);
      }

      if (msg.Typing == 1)
      {
        if (is_typing == undefined)
        {
          this.typingUsers.push(msg);
          setTimeout(() =>  this.content.scrollToBottom(), 200);
        }
        else {
          is_typing.Text = msg.Text;
        }
      }
    }
  }
}