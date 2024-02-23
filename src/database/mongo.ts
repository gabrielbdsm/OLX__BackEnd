import {connect , ConnectOptions} from 'mongoose';
import dotenv from "dotenv"

dotenv.config()

export  const mongoConnect = async()=> {
    try{        
        await connect(process.env.DATABASE as string,{

            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions)
        console.log("Conexão bem-sucedida")
    }catch(err){
        console.log("Deu error: " + err)
    }
}