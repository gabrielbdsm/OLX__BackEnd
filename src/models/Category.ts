import {connection,model,Schema , Model} from "mongoose";

type Category = {
    name: string,
    slug: string,
    
}

const modelSchema = new Schema<Category>({
    name: {type: String ,  required: true},
    slug: {type: String ,  required: true},
    
})

const modelName :string = "Categories";

export default connection && connection.models[modelName] ?
connection.models[modelName] as Model<Category>
:
model(modelName , modelSchema)