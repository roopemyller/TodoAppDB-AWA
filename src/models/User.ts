import mongoose, {Document, Schema} from "mongoose"

interface ITodo {
    todo: string
}

interface IUser extends Document {
    name: string
    todos: ITodo[]
}

let todoSchema: Schema = new Schema({
    todo: {type: String, required: true}
})

let userSchema: Schema = new Schema({
    name: {type: String, required: true},
    todos: {type: [todoSchema], default: []}
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>('User', userSchema)

export {User, IUser}