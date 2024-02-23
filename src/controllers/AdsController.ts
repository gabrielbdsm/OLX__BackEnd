import { Request , Response} from "express";

import {v4} from "uuid"
import Jimp from "jimp";
import { Buffer } from "buffer";

import Category from "../models/Category"
import User from "../models/User";
import Ad from "../models/Ad"; 
import StateModel from "../models/State";
import { ObjectId } from "mongoose";

const addImage = async(buffer : Buffer) =>{
    let newName =  `${v4()}.jpg`
    let tmpImg = await Jimp.read(buffer)
    tmpImg.cover(500,500).quality(80).write(`./public/media/${newName}`)
    return newName
}

export  const getCategories = async(req: Request , res:Response)=>{
    const cats = await Category.find()

    let categories = []

    for(let i in cats){
        categories.push({
            ...cats[i].toObject() ,
            img: `${process.env.base}/assets/images/${cats[i].slug}.png` 
        })
    }
    res.json({categories})
    
}

export  const addAction = async(req: Request , res:Response)=>{
    let {title , price , priceneg , desc , cat ,token} = req.body
    const user = await  User.findOne({token})
    if(!user){
        res.json({error: "User não encontrado"})
        return
    }
    if(!title || !cat){
        res.json({error : "Titulo e/ou categoria não foram preenchidos"})
        return
    }
    if(price){ 
        price= price.replace('.','').replace(',','.').replace("R$ ","")
        price = parseFloat(price)
    }else{
        price  = 0
    }
    const newAd = new Ad()
    newAd.status = true
    newAd.idUser =user._id.toString()
    newAd.state = user.state
    newAd.dateCreated = new Date()
    newAd.title = title
    newAd.category = cat
    newAd.price = price
    newAd.priceNegotiable = (priceneg == 'true') ? true :false
    newAd.description = desc
    newAd.views = 0

    if(req.files && req.files.img){
        if(Array.isArray(req.files.img)){
            for(let i= 0 ; i< req.files.img.length ; i++){
                if(['image/jpeg' ,'image/jpg','image/png'].includes(req.files.img[i].mimetype)){
                    let url = await addImage(req.files.img[i].data)
                    newAd.images.push({
                    url,
                    default: false
                    })
                }
            }
        }
        else{
            if(['image/jpeg' ,'image/jpg','image/png'].includes(req.files.img.mimetype)){
                let url = await addImage(req.files.img.data)
                newAd.images.push({
                    url,
                    default: false
                })
            }
        }
        
    
    }

    interface imageObject {
        url: string;
        default: boolean;
    }
    (newAd.images[0] as imageObject).default = true 
    const info = await newAd.save()
    res.json({id: info._id})
}
export  const getList = async(req: Request , res:Response)=>{
    let {sort = 'asc' , offset = 0 , limit = 8 , search ,cat ,state } = req.query
    
    interface filtersInteraces{
        status :true,
        title?: {'$regex':string; '$options': string},
        category?: string,
        state?: string
    }
    
    let filters : filtersInteraces = {status :true}
    
    if (search) {
        filters.title = { '$regex': search.toString(), '$options': 'i' };
      }
      

      if(cat){
        const c = await Category.findOne({slug:cat})
        if(c){
            filters.category = c._id.toString()
        }
      }

      if(state){
        const s = await StateModel.findOne({name: (state as string).toUpperCase()})
        if(s){

            filters.state =s._id.toString() 
        }
      }
    const adsTotal = await (await Ad.find(filters)).length

    const adsData = await Ad.find(filters)
    .sort({dateCreated: (sort == 'desc' ? -1:1)})
    .skip(parseInt(offset as string))
    .limit(parseInt(limit as string))

    let ads = []
    interface imageObject {
        url: string;
        default: boolean;
    }
    for(let i in adsData){
        let image
        
        let defaultImage  = adsData[i].images.find(e => (e as imageObject).default )
        
        if(defaultImage){
            image = `${process.env.base}/media/${(defaultImage as imageObject).url }` 
        }else{
            image = `${process.env.base}/media/default.jpg }` 
        }

        
        ads.push({
            id: adsData[i].id,
            title: adsData[i].title,
            price: adsData[i].price,
            priceNegotiable: adsData[i].priceNegotiable,
            image

        })
    }
    res.json({ads , adsTotal})
}

export  const getItem =async(req: Request , res:Response)=>{
    let {id , other = null} = req.query
    interface imageobject {
        url : string;
        default : boolean;
    }
    if(!id){
        res.json({error: 'Sem Produto'})
        return
    }
    if((id as string).length <12){
        res.json({error: "ID invalido"})
        return 
    }
    const ad = await Ad.findById(id)
    if(!ad){
        res.json({error : 'Produto inexistente'})
        return
    }

    ad.views++
    await ad.save()

    let images = []

    for (let i in ad.images){
        images.push(`${process.env.BASE}/media/${(ad.images[i] as imageobject).url}`)
    }
    let category = await Category.findById(ad.category)
    let userInfo = await User.findById(ad.idUser)
    let stateInfo = await StateModel.findById(ad.state)
    
    if(!userInfo){
        res.json("Usuario não encontrado")
        return
    }
    if(!stateInfo){
        res.json("Estado não encontrado")
        return
    }
    let others = []
    if(other){
        const otherData = await Ad.find({status: true , idUser : ad.idUser})
        
        for(let i in otherData){
            if(otherData[i]._id.toString() != ad._id.toString()){
                let image = `${process.env.BASE}/media/default.jpg`

                let defaultImg = otherData[i].images.find(e => (e as imageobject).default)
                others.push({
                    id: otherData[i]._id,
                    price: otherData[i].title,
                    priceNegotiable: otherData[i].priceNegotiable,
                    image
                })
            }
        }
    }   

    res.json({
        id: ad._id,
        title: ad.title,
        price : ad.price,
        priceNegotiable : ad.priceNegotiable,
        description : ad.description,
        views: ad.views,
        images,
        category,
        userInfo:{
            name: userInfo.name,
            email: userInfo.email
        },
        stateName: stateInfo.name

     })
}



export  const editAction = async(req: Request , res:Response)=>{
    let {id} = req.params
    let {title ,status , price , priceneg ,desc,car ,images ,token} = req.body

    if(id.length < 12){
        res.json({error : 'ID invalido'})
        return;
    }

    const ad = await Ad.findById(id)

    if(!ad){
        res.json({error : 'anuncio não encotrado'})
        return
    }

    const user = await User.findOne({token})
    if(user){
        if(user.id.toString() != ad.idUser ){
            res.json({error: 'Este anuncio não é desse usuario'})
            return
        }

    }
    else{
        res.json({error: "User não encontrado"})
        return
    }
    interface modelUpadates  {
        title ?: String,
        price?: Number,
        priceNegotiable?: Boolean,
        status ?: Boolean ,
        desc ?: String,
        car ?: String
        images ?: [{url : String , default : String}]
        
    }
    let updates : modelUpadates= {}

    if(title)[
        updates.title = title
    ]
    if(price){
        price= price.replace('.','').replace(',','.').replace("R$ ","")
        updates.price = parseFloat(price)
    }
    if(priceneg){
        updates.priceNegotiable = priceneg
    }


}
