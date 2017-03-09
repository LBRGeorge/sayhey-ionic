declare var cordova;

import { Component } from '@angular/core';
import { Platform, LoadingController } from 'ionic-angular';
import { StatusBar, Splashscreen, PowerManagement, BackgroundMode, HeaderColor } from 'ionic-native';
import {Push, PushToken, Deploy} from '@ionic/cloud-angular';

import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HomePage;

  constructor(private platform: Platform, public push: Push, public deploy: Deploy, public loadingCtrl: LoadingController) {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      Splashscreen.hide();
      StatusBar.styleDefault();

      //Update app if there's new deploys
      this.deploy.check().then((snapshotAvailable: boolean) => {
        if (snapshotAvailable){
          let loading = this.loadingCtrl.create({
            content: "Atualizando aplicativo...",
          });

          loading.present();
          this.deploy.download().then(() => {
            return this.deploy.extract().then(() => {
              loading.dismiss();
              alert("Aplicativo atualizado com sucesso!");
              this.deploy.load();
            });
          });
        }
        /*else {
          this.deploy.getSnapshots().then((snapshots) => {
            // snapshots will be an array of snapshot uuids

            for(let id of snapshots)
            {
              this.deploy.deleteSnapshot(id);
            }
          });
        }*/
      });

      if (this.platform.is('android'))
      {
        HeaderColor.tint("#62599C");
        cordova.plugins.autoStart.enable();
      }

      /*cordova.plugins.backgroundMode.enable();*/

      //BackgroundMode.enable();

      PowerManagement.dim()
        .then(() => {
          console.log('Wakelock acquired');
        }, () => {
          console.log('Failed to acquire wakelock');
        });


      PowerManagement.setReleaseOnPause(false)
        .then(() => {
          console.log('setReleaseOnPause successfully');
        }, () => {
          console.log('Failed to set');
        });
    });
  }

  hideSplashScreen() {
    if (Splashscreen)
    {
      setTimeout(() => {
        Splashscreen.hide();
      }, 100);
    }
  }
}
