import mongoose from "mongoose";
import { connected } from "process";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    if(connectionState === 1){
        console.log("Already Connected");
        return;
    }

    if(connectionState === 2){
        console.log("Connecting...");
        return;
    }
    else{
        console.log(connectionState);
    }

    try{
        mongoose.connect(MONGODB_URI!, {
            // this is next 15 not 14
            dbName: 'next14-mongodb-blogrestapi',
            bufferCommands: true
        });
        console.log("Connected");
    } catch (err: any){
        console.log("Error: ", err);
        throw new Error("Error: ", err);
    }
};

export default connect;