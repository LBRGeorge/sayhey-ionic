import { Storage } from '@ionic/storage';
import { User } from './../models/user.model';
import { Channel } from './../models/channel.model';
import { UserService } from './user-service';
import { Injectable } from '@angular/core';
import * as io from "socket.io-client";

@Injectable()

export class SocketService {

    user_id: number;
    user_token: string;

    private host: string = "http://chat.lbr-gang.com:5192";
    socket: any;


    listenOnGroupMessage: Function;

    constructor(public userService: UserService, public storage: Storage) {

        this.getStorage()
            .then((data) => {
                if (this.socket == undefined && data.user_id != undefined && data.user_token != undefined)
                {
                    this.user_id = data.user_id;
                    this.user_token = data.user_token;

                    this.socket = io.connect(this.host);

                    this.socket.on("connect", () => this.onConnect());
                    this.socket.on("onlineUsers", (list) => this.onUsersOnline(list));
                    
                    this.socket.on("error", (error: string) => {
                        console.log("Socket Connection Error ", error);
                    });
                }
            });
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

    get() {
        this.socket = io.connect(this.host);

        this.socket.on("connect", () => this.onConnect());
        this.socket.on("onlineUsers", (list) => this.onUsersOnline(list));

        this.socket.on("error", (error: string) => {
            console.log("Socket Connection Error ", error);
        });
    }

    getOnlineUsers(groupID: number){
        console.log("Getting online users");
        this.socket.emit("getOnlineUsers", {GroupID: groupID});
    }

    sendGroupMessage(user: User, groupID: number, message: string, contentID: number){
        this.socket.emit("newMessage", {
            UserID: user.ID,
            Username: user.Username,
            UserAvatar: "",
            GroupID: groupID,
            ContentID: contentID,
            Message: message
        });
    }

    //EVENTS

    private onConnect() {
        
        //Let's setup the User
        this.userService.getUserChannels()
        .then((channels: Channel[]) => {
            let groups: Array<number> = [];
            
            for(let gp of channels)
            {
                groups.push(gp.ID);
            }

            this.socket.emit("setupUser", {ID: this.user_id, Username: "George", Groups: groups});
            console.log("> Socket Connected! " + JSON.stringify(groups));
        });
    }

    private onUsersOnline(list) {
        console.log(list);
    }
}