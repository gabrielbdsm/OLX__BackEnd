import { validationResult, matchedData} from "express-validator"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import State from "../models/State"
import { Request , Response } from "express"
import User from "../models/User";
import Ad from "../models/Ad";
import Category  from "../models/Category";
import { json } from "stream/consumers";

export  const getStates = async(req: Request , res:Response)=>{
    let states = await State.find();
    res.json({states})
}

export  const info = async(req: Request , res: Response)=>{
    if(!req.body.token  && !req.query.token ){
        res.json({notAllwed: true})
        return
    }
    let token = req.query.token as string
       
    let adList = []
    const user = await User.findOne({token})
    if(user){
        const state = await State.findById(user.state)
        const ads = await Ad.find({idUser: user._id.toString()})
        for (let i in ads){
            const cat = await Category.findById(ads[i].category)
            if(cat){

                adList.push({...ads[i] , Category : cat.slug})
            }else{
                res.json({error:"Categoria não encontrada"})
            }
        }
    }
    else{
        res.json({err : "User não encontrado"})
        return
    }

    res.json({})
}
export  const editAction =  async(req: Request , res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({error: errors.mapped()})
        return;
    }
    const data= matchedData(req)
    
    let updates : {[key: string]: any}   = {}
    const user = await User.findOne({token : data.token})
    console.log(updates)
    if(data.name){
        updates.name = data.name
    }
    if (data.email) {
        const emailCheck = await User.findOne({email : data.email})
        if (emailCheck){
            res.json({error : "E-mail já existente!"})
            return
        }
        updates.email = data.email
        
    }
    if (data.state) {
        if(mongoose.Types.ObjectId.isValid(data.state)){
            const stateCheck = await State.findById(data.state)
            if(!stateCheck){
                res.json({error: "Estado não encontrado"})
                return
            }
            updates.state = data.state
        }else{
            res.json({error : "Codigo de estado errado"})
            return
        }
    }
    if(data.password){
        
        if(user){
            
            const match = await bcrypt.compare(data.password , user.passwordHash)
            if(match){
                res.json({error: "Senha já cadrastada"})
                return
            }
            updates.passwordHash =  await bcrypt.hash(data.password ,10)
        
        }else{
            res.json({error : "Usuario não encontrado"})
        }
    }
    await User.findOneAndUpdate({token: data.token} , {$set : updates})
    res.json({})
}
