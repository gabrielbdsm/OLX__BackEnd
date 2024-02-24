import dotenv from 'dotenv';
import express, { Request , Response} from "express";
import {mongoConnect }from "./database/mongo"
import cors from "cors";
import fileUpload from "express-fileupload"
import router from './routes/routes';


dotenv.config();
mongoConnect();



const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: true}))
server.use(fileUpload())

server.use(express.static(__dirname + "./public"))

server.use('/' , router)


server.listen(process.env.PORT)