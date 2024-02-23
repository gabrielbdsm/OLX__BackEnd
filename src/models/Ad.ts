import {connection,model,Schema , Model} from "mongoose";

type Ad = {
    idUser: string,
    state: string,
    category: string,
    images: [object],
    dateCreated: Date,
    title: string,
    price: number,
    priceNegotiable: boolean,
    description: string,
    views: number,
    status: boolean
}

const modelSchema = new Schema<Ad>({
    idUser: {type: String, required : true},
    state: {type: String},
    category: {type: String , required: true},
    images: [{
    url: { type: String, required: true },
    default: { type: Boolean, default: false }
  }],
    dateCreated: {type: Date , required: true},
    title: {type: String , required: true},
    price: {type: Number},
    priceNegotiable: {type:Boolean},
    description: {type: String , required: true},
    views: {type: Number},
    status: {type: Boolean }
})

const modelName :string = "Ads";

export default connection && connection.models[modelName] ?
connection.models[modelName] as Model<Ad>
:
model(modelName , modelSchema)