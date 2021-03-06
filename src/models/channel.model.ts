export class Channel {
    /**
     *
     */
    constructor(
        public ID: number,
        public Name: string,
        public Topic: string,
        public Creator: string,
        public CreatedDate: string,
        public Image: string,
        public Users: Array<any>,
        public LastMessage: string,
        public LastMessageUser: string,
        public LastMessageDate: string,
        public UnreadCount: number = 0
    ) {}
}