import {connection,Model,model,Schema} from "mongoose";

type StateType = {
    name: string,
}

const modelSchema = new Schema<StateType>({
    name: {type: String ,  required: true}
})

const modelName :string = "States";

export default connection && connection.models[modelName] ?
connection.models[modelName] as Model<StateType>
:
model(modelName , modelSchema)