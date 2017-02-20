import { RegisterPage } from './../pages/register/register';
import { LoginPage } from './../pages/login/login';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from './../providers/user-service';
import { SocketService } from './../providers/socket.service';
import { ChatModalPage } from './../pages/chat-modal/chat-modal';
import { ChannelsPage } from './../pages/channels/channels';
import { JoinedPage } from './../pages/joined/joined';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PopOverUserInfoPage } from '../pages/pop-over-user-info/pop-over-user-info';


//Setting up storage
export function provideStorage() {
  return new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__sayheydb' });
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    HomePage,
    JoinedPage,
    ChannelsPage,
    ChatModalPage,
    PopOverUserInfoPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    HomePage,
    JoinedPage,
    ChannelsPage,
    ChatModalPage,
    PopOverUserInfoPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: Storage, useFactory: provideStorage},
    SocketService,
    UserService
    ]
})
export class AppModule {}
