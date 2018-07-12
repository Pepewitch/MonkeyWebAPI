import { ClassSocket } from "./class";

export class Sockets {

    public static getInstance(): Sockets {
        if (!this.instance) {
            this.instance = new Sockets();
        }
        return this.instance;
    }

    private static instance: Sockets;

    private constructor() { }

    public init() {
        ClassSocket.getInstance().init();
    }

}
