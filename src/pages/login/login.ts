import { HomePage } from './../home/home';
import { UserService } from './../../providers/user-service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public userService: UserService) {}

  
  doLogin(username: string, password: string, button, passwordField)
  {
    let loading = this.loadingCtrl.create({
      content: "Aguarde por favor...",
    });
    
    loading.present();

    this.userService.userLogin(username, password)
      .then((result: boolean) => {
        if (result == true)
        {
          loading.dismiss();
          console.log("Logado!");
          this.navCtrl.setRoot(HomePage);
        }
        else {
          let alert = this.alertCtrl.create({
            title: "Autenticação",
            message: "Usuário/senha inválido!",
            buttons: ["Ok"]
          });
          
          passwordField.value = '';

          loading.dismiss();
          alert.present();
        }
      });
  }

}
