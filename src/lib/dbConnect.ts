import mongoose from "mongoose";

type ConnectionObject = {
    isConnectedd?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>{
    if(connection.isConnectedd){
        console.log("Already connected to database");
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI  || '', {});

        connection.isConnectedd = db.connections[0].readyState

        // console.log(db)
        // console.log(db.Connection)b
        
        console.log("DB connect  Succesfully")
    } catch (error) {
        console.log("Dtabase Connection failed", error)
        process.exit(1)
    }
}

export default dbConnect

