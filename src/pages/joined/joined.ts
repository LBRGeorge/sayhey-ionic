import { SocketService } from './../../providers/socket.service';
import { ChatModalPage } from './../chat-modal/chat-modal';
import { UserService } from './../../providers/user-service';
import { Channel } from './../../models/channel.model';
import { User } from './../../models/user.model';
import { PopOverUserInfoPage } from '../pop-over-user-info/pop-over-user-info';
import { Component, OnInit } from '@angular/core';
import { App, NavController, NavParams, ModalController, PopoverController, ToastController, Platform } from 'ionic-angular';
import { Push, PushToken } from '@ionic/cloud-angular';
import { NativeAudio, LocalNotifications, BackgroundMode } from 'ionic-native';
import { Vibration } from 'ionic-native';

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

  constructor(private platform: Platform, public push: Push, public navCtrl: NavController, public navParams: NavParams, private appCtrl: App, private modalCtrl: ModalController, private popoverCtrl: PopoverController, private toastCtrl: ToastController, private userService: UserService, private socketService: SocketService) {
    
    this.startSocket = setInterval(() => {
      if (this.socketService.socket != undefined)
      {
        //Get local user
        this.localUser = new User(0, "", "", "", "");
        this.userService.getLocalUser()
          .then((user: User) => {
            this.localUser = user;
            this.socketService.socket.on("userGroupMessage", (message) => this.onGroupMessageReceive(message));
            this.socketService.socket.on("disconnect", () => this.onDisconnect());

            //curl -X POST --header "Content-Type:application/json" --header "Authorization: key=AAAA0740mhY:APA91bFGeTrpDJwKs-UpVTIjgjh5LzRFvtO5T5MiPDg4wkzqdwHpnUFRkxt5EYexDgaPUPzX5GqP-P5M4i9DN2cZxrDFj2_e0VX2oz50FWdHLg9bNNaY-dFduuHeJsinPfrEVU8v7seb" "https://gcm-http.googleapis.com/gcm/send" -d "{\"to\": \"djdOQBWrgKs:APA91bGQJJuMzzOGKxxFea70O1G1jJn_Z9gsI-9rBoULqnk_M2w7C6Oymv8LSw119kOg4GltUzeVLf7ZbzZ3NpODl5QC2UMSyQwekSHD4wxNsqsZuYAT_E3LNTF99c7qIiiomPAlIReH\", \"data\":{\"text\":\"Eae mano!\"}}"
            if (this.platform.is('cordova'))
            {
              this.push.register().then((t: PushToken) => {
                alert("token: " + t.token);
                return this.push.saveToken(t);
              }).then((t: PushToken) => {
                console.log('Token saved:', t.token);
              });

              this.push.rx.notification()
                .subscribe((msg) => {
                  this.makeNotification(msg.text);
              });
            }
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

    LocalNotifications.clearAll();
  }

  makeNotification(text: string)
  {
    this.notificationsMessages += text + "\r\n";

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
        this.makeNotification(channel.Name + " @ " + message.Username + ": " + message.Message);
      }
    }
  }

  private onDisconnect() {
      let toast = this.toastCtrl.create({
        message: "Servidor desconectado!",
        duration: 30000,
        closeButtonText: "OK",
        showCloseButton: true
      });

      toast.present();
  }

}
