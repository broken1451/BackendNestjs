import express from "express";


// export const app =  express();

export default class Server {

    public app: express.Application;
    public port: number;

    constructor() {
        this.app = express();
        this.port = Number(process.env.PORT) || 3500;
    }

    start(port: number, callback: any){
        this.app.listen(port, callback);
    }
}