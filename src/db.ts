import mongoose, {model, Schema} from "mongoose"

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
})

const ContentSchema = new Schema({
    type: String,
    link: String,
    title: String,
    tags: [{type: mongoose.Types.ObjectId, ref:'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User'}
})

export const UserModel = model("User", UserSchema);
export const ContentModel = model("Content", ContentSchema);