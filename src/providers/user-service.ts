import { User } from './../models/user.model';
import { Channel } from './../models/channel.model';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService {

  user_id = 1;
  user_token = "ZDC2HGbkJn67wrCq72aZ6D3SLEDgBLNsrdP3tKKYTjcWsvLU4hLwNDSjSpbuYHRFbnFD97NXnpcJG2vRyeWEtrfKWUgv8a3RJfsf";
  baseUri: string;

  constructor(public http: Http) {
    this.baseUri = "http://chat.lbr-gang.com/";
  }

  getLocalUser(): Promise<User>{
    
    return this.http.get(this.baseUri + "?api=getuserinfo&userid=" + this.user_id + "&token=" + this.user_token)
      .toPromise()
      .then(response => response.json().User as User)
      .catch(error => console.log("Erro ao autenticar usuário", error));
  }

  getUser(id: number): Promise<User>{
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(this.baseUri + "?api=getuserinfo&userid=" + this.user_id + "&token=" + this.user_token, JSON.stringify({target: id}), {headers: headers})
      .toPromise()
      .then(response => response.json().User as User)
      .catch(error => console.log("Erro ao autenticar usuário", error));
  }

  getUserChannels(): Promise<Channel[]>{
    return this.http.get(this.baseUri + "?api=getusergroups&userid=" + this.user_id + "&token=" + this.user_token)
      .toPromise()
      .then(response => response.json().Channels as Channel[])
      .catch(error => console.log("Erro ao autenticar usuário", error));
  }
}
