import { UserService } from './../../providers/user-service';
import { User } from './../../models/user.model';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';

/*
  Generated class for the PopOverUserInfo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-pop-over-user-info',
  templateUrl: 'pop-over-user-info.html'
})
export class PopOverUserInfoPage {

  localUser: User;
  result: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController, public toastCtrl: ToastController, public userService: UserService) {
    this.localUser = new User(0, "", "", "", "");
  }

  ngOnInit(){
    this.userService.getLocalUser()
      .then((user: User) => this.localUser = user);
  }

  doLogout(){
    let alert = this.alertCtrl.create({
      title:"Sair",
      message:"Deseja realmente sair?",
      buttons:
      [
        "Não",
        {
          text:"Sim",
          handler: () => {
            this.userService.userLogout()
              .then((result: boolean) => {
                if (result == true)
                {
                  console.log("> Saiu!");
                  this.result = true;
                  this.viewCtrl.dismiss();
                }
                else {
                  let toast = this.toastCtrl.create({
                    message: "Não foi possível realizar logout",
                    duration: 2000
                  });

                  toast.present();
                }
              });
          }
        }
      ]
    });

    alert.present();
  }

}
