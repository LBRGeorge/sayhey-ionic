import { User } from './../../models/user.model';
import { UserService } from './../../providers/user-service';
import { Storage } from '@ionic/storage';
import { LoginPage } from './../login/login';
import { SocketService } from './../../providers/socket.service';
import { ChannelsPage } from './../channels/channels';
import { JoinedPage } from './../joined/joined';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';


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
    })
    .catch(error => console.log("Error ", error));

    //this.socketService.get();
  }

}
