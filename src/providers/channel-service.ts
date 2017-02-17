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

  user_id = 1;
  user_token = "ZDC2HGbkJn67wrCq72aZ6D3SLEDgBLNsrdP3tKKYTjcWsvLU4hLwNDSjSpbuYHRFbnFD97NXnpcJG2vRyeWEtrfKWUgv8a3RJfsf";
  baseUri: string;

  constructor(public http: Http) {
    this.baseUri = "http://chat.lbr-gang.com/";
  }

  getChannelMessages(channel: Channel): Promise<Message[]>{
    return this.http.get(this.baseUri + "?api=getgroupmessages&groupID="+channel.ID+"&userid=" + this.user_id + "&token=" + this.user_token)
      .toPromise()
      .then((response) => response.json().Messages as Message[],
             error => console.log("Error ao tentar obter mensagens", error));
  }

  /*getAll(): void {
    this.http.get(this.baseUri + "?api=getmyinfo&userid=")
  }*/

}
