import { Storage } from '@ionic/storage';
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

  //user_id = 1;
  //user_token = "ZDC2HGbkJn67wrCq72aZ6D3SLEDgBLNsrdP3tKKYTjcWsvLU4hLwNDSjSpbuYHRFbnFD97NXnpcJG2vRyeWEtrfKWUgv8a3RJfsf";
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

  userLogin(username: string, password: string): Promise<boolean> {
    let _headers = new Headers();
    //_headers.append("Access-Control-Allow-Headers", "*");
    _headers.append("Content-Type", "application/json");

    return this.http.get(this.baseUri + "?api=login&textUsername=" + username + "&textPassword=" + password + "&app")
            .toPromise()
            .then((response) => {
              let data: any = response.json();

              if (data.Error.length > 0)
              {
                console.log("Login Error: " + data.Error);
                return false;
              }
              else {
                this.storage.set("user_id", data.user_id);
                this.storage.set("user_token", data.user_token);
                return true;
              }
            })
          .catch(error => console.log("Error ao realizar login ", error));
  }

  userLogout(): Promise<boolean> {
    return this.storage.remove("user_id")
      .then((response_id) => {
        return this.storage.remove("user_token")
          .then((response_token) => {
            if (response_id == undefined && response_token == undefined) return true;
            else return false;
          });
      });
  }

  userRegister(email: string, username: string, password: string): Promise<any> {
    return this.http.get(this.baseUri + "?api=register&textRegisterEmail=" + email + "&textRegisterUsername=" + username + "&textRegisterPassword=" + password)
      .toPromise()
      .then((response) => response.json())
      .catch(error => console.log("Error ao realizar cadastro ", error));
  }

  getLocalUser(): Promise<User>{
    
    return this.getStorage()
      .then((data: any) => {
        
        return this.http.get(this.baseUri + "?api=getuserinfo&userid=" + data.user_id + "&token=" + data.user_token)
          .toPromise()
          .then(response => {
            let user: any = response.json().User;

            if (user != undefined) return user as User;
            else return undefined;
          })
          .catch(error => console.log("Erro ao autenticar usuário", error));
      });
  }

  getUserChannels(): Promise<Channel[]>{
    return this.getStorage()
      .then((data) => {
        return this.http.get(this.baseUri + "?api=getusergroups&userid=" + data.user_id + "&token=" + data.user_token)
          .toPromise()
          .then(response => {
            let channels = response.json().Channels;

            if (channels != undefined) return channels as Channel[]
            return new Array<Channel>();
          })
          .catch(error => console.log("Erro ao autenticar usuário", error));
      });
  }

  joinUserChannel(channel: Channel): Promise<boolean> {
    return this.getStorage()
      .then((data) => {
        return this.http.get(this.baseUri + "?api=joingroup&groupID=" + channel.ID + "&userid=" + data.user_id + "&token=" + data.user_token)
          .toPromise()
          .then(response => {
            let result = response.json();

            if (result.Error.length > 0) return false;
            else return true;
          })
          .catch(error => console.log("Erro ao autenticar usuário", error));
      });
  }

  saveFCMToken(token: string): Promise<boolean> {
    return this.getStorage()
      .then((data) => {
        return this.http.get(this.baseUri + "?api=save_fcmtoken&fcm_token=" + token + "&userid=" + data.user_id + "&token=" + data.user_token)
          .toPromise()
          .then(response => {
            let result = response.json();

            if (result.Error.length > 0) return false;
            else return true;
          })
          .catch(error => console.log("Erro ao autenticar usuário", error));
      });
  }
}
