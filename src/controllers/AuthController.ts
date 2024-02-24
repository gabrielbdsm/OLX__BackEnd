import { validationResult, matchedData} from "express-validator"
import { Request , Response} from "express";
import bcrypt from "bcrypt"
import mongoose from "mongoose";
import User from "../models/User"
import State from "../models/State";

export  const signup = async(req : Request ,res: Response)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({error: errors.mapped()})
        return;
    }
    const data= matchedData(req)
   
    //Verificando se o email já existe

        const user = await User.findOne({
            email : data.email
        });
        if(user){
            res.json({
                error:{
                    email:{msg: "error email já existe"}
                }
            })
            return;
        }
        
        //verificando se o estado existe
    if(mongoose.Types.ObjectId.isValid(data.state)){
     
        const stateItem = await State.findById(data.state)
     
        if(!stateItem){
            res.json({
                error:{
                    email:{msg: "Estado não existe"}
                }
            })
            return;
        }
        res.json({status:"ok"})
        
    }else{
        res.json({
            error:{
                email:{msg: "código de estado invalido"}
            }
        })
        return;
    }

    const passwordHash = await bcrypt.hash(data.password ,10)

    const payload = (Date.now() + Math.random()).toString();
    const token = await bcrypt.hash(payload , 10);

    const newUser = new User({
        name: data.name,
        email: data.email,
        passwordHash,
        token,
        state: data.state
    })
    await newUser.save()

}
export  const signin = async(req : Request ,res: Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({error: errors.mapped()})
        return;
    }
    const data= matchedData(req)
    //validando email
   const user = await User.findOne({email: data.email});
    if (!user) {
        res.json({error : "Email e/ou senha errados"})
        return
   }
  
    //validando senha
    const match = await bcrypt.compare(data.passwordHash , user.passwordHash)
    
    if(!match){
        res.json({error : "Email e/ou senha errados"})
        return
   }
   const payload = (Date.now() + Math.random()).toString();
    const token = await bcrypt.hash(payload , 10);
   user.token = token;
   await user.save()
   res.json({token, email:data.email})
}

