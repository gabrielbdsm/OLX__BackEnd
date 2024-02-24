import { Request , Response ,NextFunction} from "express";

import User from "../models/User"

export const routePrivate = async (req: Request , res:Response ,next : NextFunction)=>{
    if(!req.query.token  && !req.body.token){
        
        res.json({notAllwed: true})    
        
        return
    }
    let token: string = '';
    
    if(req.query.token){
        token = req.query.token as string
   
       
    }
    else if(req.body.token){
        token = req.body.token as string
       
    }
    else if(token == ''){
        
        res.json({notAllwed: true})
        return
    }
    

     const user = await User.findOne({token:token} )
   
    if(!user){
        
        res.json({notAllwed: true})
        return
    }
    
    next()
}