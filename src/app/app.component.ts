import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, PowerManagement } from 'ionic-native';
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

      this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        console.log('Token saved:', t.token);
      });

      this.push.rx.notification()
        .subscribe((msg) => {
          alert(msg.title + ': ' + msg.text);
      });

      /*var push = PushNotification.init({
        android: {
            senderID: "12345679"
        },
        browser: {
            pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        },
        ios: {
            alert: "true",
            badge: true,
            sound: 'false'
        },
        windows: {}
    });*/

      /*this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        console.log('Token saved:', t.token);
      });

      cordova.plugins.backgroundMode.enable();*/

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
