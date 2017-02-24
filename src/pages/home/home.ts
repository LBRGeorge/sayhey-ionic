import { User } from './../../models/user.model';
import { UserService } from './../../providers/user-service';
import { LoginPage } from './../login/login';
import { SocketService } from './../../providers/socket.service';
import { ChannelsPage } from './../channels/channels';
import { JoinedPage } from './../joined/joined';
import { Component } from '@angular/core';
import { Platform, NavController, LoadingController } from 'ionic-angular';

//import { BackgroundMode } from 'ionic-native';
import {NativeAudio} from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tabRoot1: any;
  tabRoot2: any;

  constructor(private platform: Platform, public navCtrl: NavController, public loadingCtrl: LoadingController, public socketService: SocketService, public userService: UserService) {
    
    this.tabRoot1 = JoinedPage;
    this.tabRoot2 = ChannelsPage;

    this.userService.getLocalUser()
    .then((user: User) => {
      
      if (user == undefined)
      {
        this.navCtrl.setRoot(LoginPage);
      }
      else {
        this.socketService.start();
      }
    })
    .catch(error => console.log("Error ", error));

    NativeAudio.preloadSimple('notification1', 'assets/sound.mp3').then(() => console.log("Sound loaded!"), (error) => console.log("Failed to load sound!", error));

    platform.registerBackButtonAction(() => this.avoidCloseApp());
  }

  avoidCloseApp() {
    if (this.navCtrl != undefined)
    {
      if (this.navCtrl.getActive().name != "JoinedPage")
      {
        this.navCtrl.pop();
        return;
      }
      else {
        window['plugins'].appMinimize.minimize();
      }
    }
  }
}
