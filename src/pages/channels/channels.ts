import { User } from './../../models/user.model';
import { SocketService } from './../../providers/socket.service';
import { UserService } from './../../providers/user-service';
import { ChannelService } from './../../providers/channel-service';
import { Channel } from './../../models/channel.model';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

/*
  Generated class for the Channels page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-channels',
  templateUrl: 'channels.html',
  providers: [ChannelService]
})
export class ChannelsPage {

  channels: Channel[];
  localUser: User;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public toastCtrl: ToastController, public channelService: ChannelService, public userService: UserService, public socketService: SocketService) {
    this.localUser = new User(0, "", "", "", "");

    //Get local user
    this.userService.getLocalUser()
      .then((user: User) => this.localUser = user);
  }

  ngOnInit(){
    this.channelService.getAllChannels()
      .then((channels: Channel[]) => this.channels = channels);
  }

  joinChannel(channel: Channel) {
    let alert = this.alertCtrl.create({
      title: "Entrar no channel",
      message: "Deseja realmente entrar no channel '" + channel.Name + "'",
      buttons: [
        {
          text: "Sim",
          handler: data => {
            this.userService.joinUserChannel(channel)
              .then((result: boolean) => {
                
                if (result == true)
                {
                  this.socketService.joinChannel(channel.ID, this.localUser);

                  let toast = this.toastCtrl.create({
                    message: "Você entrou no channel: '" + channel.Name + "'",
                    duration: 5000,
                    showCloseButton: true,
                    closeButtonText: "OK"
                  });

                  toast.present();
                }
                else {
                  let toast = this.toastCtrl.create({
                    message: "Não foi possível entrar no channel!",
                    duration: 5000,
                    showCloseButton: true,
                    closeButtonText: "OK"
                  });

                  toast.present();
                }
              });
          }
        },
        "Não"
      ]
    });

    alert.present();
  }
}
