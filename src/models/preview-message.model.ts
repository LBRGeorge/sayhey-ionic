export class PreviewMessage {
    /**
     *
     */
    constructor(
        public UserID: number,
        public Username: string,
        public UserAvatar: string,
        public GroupID: number,
        public Typing: number,
        public Text: string
    ) {}
}