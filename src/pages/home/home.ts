import { User } from './../../models/user.model';
import { UserService } from './../../providers/user-service';
import { LoginPage } from './../login/login';
import { SocketService } from './../../providers/socket.service';
import { ChannelsPage } from './../channels/channels';
import { JoinedPage } from './../joined/joined';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { BackgroundMode } from 'ionic-native';
import {NativeAudio} from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tabRoot1: any;
  tabRoot2: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public socketService: SocketService, public userService: UserService) {
    
    this.tabRoot1 = JoinedPage;
    this.tabRoot2 = ChannelsPage;

    this.userService.getLocalUser()
    .then((user: User) => {
      
      if (user == undefined)
      {
        this.navCtrl.setRoot(LoginPage);
      }
      else {
        BackgroundMode.enable();
        this.socketService.start();
      }
    })
    .catch(error => console.log("Error ", error));

    NativeAudio.preloadSimple('notification1', 'assets/sound.mp3').then(() => console.log("Sound loaded!"), (error) => console.log("Failed to load sound!", error));
    //this.socketService.get();
  }

}
