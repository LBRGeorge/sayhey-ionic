import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, PowerManagement, BackgroundMode } from 'ionic-native';
import {Push, PushToken} from '@ionic/cloud-angular';

import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HomePage;

  constructor(private platform: Platform, public push: Push) {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      Splashscreen.hide();
      StatusBar.styleDefault();

      /*cordova.plugins.backgroundMode.enable();*/

      BackgroundMode.enable();

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
