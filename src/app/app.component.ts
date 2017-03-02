import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, BackgroundMode, PowerManagement } from 'ionic-native';

import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HomePage;

  constructor(private platform: Platform) {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      Splashscreen.hide();
      StatusBar.styleDefault();

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
