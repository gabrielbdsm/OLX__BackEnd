import {connection,model,Model,Schema} from "mongoose";

type UserType = {
    name: string,
    email: string,
    state: string,
    passwordHash: string;
    token:string
}

const modelSchema = new Schema<UserType>({
    name: {type: String ,  required: true},
    email: {type: String ,  required: true},
    state: {type: String},
    passwordHash: {type: String , required: true},
    token: {type: String}
})

const modelName :string = "users";

export default connection && connection.models[modelName] ?
connection.models[modelName] as Model<UserType>
:
model(modelName , modelSchema)