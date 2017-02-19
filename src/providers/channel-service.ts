import { Storage } from '@ionic/storage';
import { Message } from './../models/message.model';
import { Channel } from './../models/channel.model';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';


/*
  Generated class for the ChannelService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ChannelService {

  baseUri: string;

  constructor(public http: Http, public storage: Storage) {
    this.baseUri = "http://chat.lbr-gang.com/";
  }

  getStorage(): Promise<any> {
    return this.storage.get("user_id")
          .then((userID) => {
            return this.storage.get("user_token")
              .then((userToken) => {
                return {user_id: userID, user_token: userToken};
              })
              .catch(error => console.log("Error on get user token", error))
          })
          .catch(error => console.log("Error on get user id", error));
  }

  getChannelMessages(channel: Channel): Promise<Message[]>{

    return this.getStorage()
      .then((data) => {
        return this.http.get(this.baseUri + "?api=getgroupmessages&groupID="+channel.ID+"&userid=" + data.user_id + "&token=" + data.user_token)
          .toPromise()
          .then((response) => response.json().Messages as Message[],
                error => console.log("Error ao tentar obter mensagens", error));
      });
  }

  /*getAll(): void {
    this.http.get(this.baseUri + "?api=getmyinfo&userid=")
  }*/

}
