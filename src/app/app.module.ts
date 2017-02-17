import { ChatModalPage } from './../pages/chat-modal/chat-modal';
import { ChannelsPage } from './../pages/channels/channels';
import { JoinedPage } from './../pages/joined/joined';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    JoinedPage,
    ChannelsPage,
    ChatModalPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    JoinedPage,
    ChannelsPage,
    ChatModalPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
