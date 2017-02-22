export class Message {
    /**
     *
     */
    constructor(
        public ID: number,
        public UserID: number,
        public Username: string,
        public Avatar: string,
        public Text: string,
        public Date: string,
        public Sent: boolean = true,
        public UserStatus: number = 1,
    ) {}
}