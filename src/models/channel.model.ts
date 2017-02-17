export class Channel {
    /**
     *
     */
    constructor(
        public ID: number,
        public Name: string,
        public Topic: string,
        public LastMessage: string,
        public LastMessageDate: string
    ) {}
}