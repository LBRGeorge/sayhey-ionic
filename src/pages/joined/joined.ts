import { SocketService } from './../../providers/socket.service';
import { ChatModalPage } from './../chat-modal/chat-modal';
import { UserService } from './../../providers/user-service';
import { Channel } from './../../models/channel.model';
import { User } from './../../models/user.model';
import { PopOverUserInfoPage } from '../pop-over-user-info/pop-over-user-info';
import { Component, OnInit } from '@angular/core';
import { App, NavController, NavParams, ModalController, PopoverController } from 'ionic-angular';

import { NativeAudio } from 'ionic-native';
import { Vibration } from 'ionic-native';
import { LocalNotifications } from 'ionic-native';

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
  localUser: User;
  startSocket: any;

  notificationsMessages: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private appCtrl: App, private modalCtrl: ModalController, private popoverCtrl: PopoverController, private userService: UserService, private socketService: SocketService) {
    
    this.startSocket = setInterval(() => {
      if (this.socketService.socket != undefined)
      {
        //Get local user
        this.localUser = new User(0, "", "", "", "");
        this.userService.getLocalUser()
          .then((user: User) => {
            this.localUser = user;
            this.socketService.socket.on("userGroupMessage", (message) => this.onGroupMessageReceive(message));
          });
        clearInterval(this.startSocket);
      }
    }, 1000);
  }
  
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

    channel.UnreadCount = 0;
    this.navCtrl.push(ChatModalPage, {channel: channel});
  }



  //EVENTS
  private onGroupMessageReceive(message){
    console.log("Message received from: " + message.Username);

    let channel = this.channels.find(p => p.ID == message.GroupID);

    if (channel != undefined)
    {
      channel.LastMessage = message.Message;
      channel.LastMessageUser = message.Username;
      channel.LastMessageDate = message.Date;

      if (channel.UnreadCount == undefined) channel.UnreadCount = 1;
      else channel.UnreadCount++;
      
      if (message.UserID != this.localUser.ID)
      {
        this.notificationsMessages += channel.Name + " @ " + message.Username + ": " + message.Message + "\r\n";

        NativeAudio.play('notification1').then(null, (error) => console.log("Failed to play notification sound", error));
        Vibration.vibrate(500);
        
        LocalNotifications.getScheduledIds()
          .then((ids: number[]) => {
            let id = 0;

            if (ids != undefined)
            {
              if (ids.length > 0) id = ids[0];
            }

            /*------------------------------------------*/

            if (id == 0)
            {
              LocalNotifications.schedule({
                id: 1,
                title: 'SayHey!',
                text: this.notificationsMessages,
                sound: null,
                led: "00FF00"
              });
            }
            else {
              LocalNotifications.update({
                id: id,
                title: 'SayHey!',
                text: this.notificationsMessages,
                sound: null,
                led: "00FF00"
              });
            }
          },
          (error) => console.log("Couldn't display notification", error));
      }
    }
  }

}
