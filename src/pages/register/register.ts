import { LoginPage } from './../login/login';
import { UserService } from './../../providers/user-service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';

/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public userService: UserService) {}

  doRegister(txtEmail, txtUsername, txtPassword){
    let loading = this.loadingCtrl.create({
      content: "Realizando cadastro, aguarde por favor..."
    });

    loading.present();

    this.userService.userRegister(txtEmail.value, txtUsername.value, txtPassword.value)
      .then((response: any) => {
        loading.dismiss();

        if (response.Error.length > 0)
        {
          let alert = this.alertCtrl.create({
            title: "Cadastro",
            message: "Não foi possível realizar o cadastro. Motivo: " + response.Error,
            buttons: ["Ok"]
          });

          alert.present();
        }
        else {
          let toast = this.toastCtrl.create({
            message: "Cadastro realizado com sucesso!",
            duration: 2000,
            showCloseButton: true,
            closeButtonText: "OK"
          });

          toast.onDidDismiss(() => {
            this.navCtrl.setRoot(LoginPage);
          });

          toast.present();
        }
      });
  }

  private isValidEmail(emailAddress: string)
  {
    let pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return pattern.test(emailAddress);
  }
}
