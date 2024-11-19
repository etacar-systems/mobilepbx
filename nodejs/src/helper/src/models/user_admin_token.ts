import mongoose ,{Schema,Document} from "mongoose";

export interface user_admin_token{
    admin_id:String;
    token:String;
}

export interface user_admin_tokenModel extends user_admin_token , Document {}

const prepSchema:Schema = new Schema({
    admin_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user_admin",
        required: "admin_id is required"
    },
    token:{
        type:String,
        required: "token is required"
    },
    is_deleted: {
        type: Number,
        enum:[0,1],
        default:0
    }
},{
    timestamps: true
})

export default mongoose.model<user_admin_tokenModel>("user_admin_token", prepSchema);
