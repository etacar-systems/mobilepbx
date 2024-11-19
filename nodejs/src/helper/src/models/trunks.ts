import mongoose,{ Schema,Document } from "mongoose";

export interface Trunks{
    trunk_name:String;
    description:String;
    secret:String;
    authentication:String;
    registration:String;
    sip_server:String;  
    sip_server_port:String;
    context:String;
    transport:String;
    is_deleted:Number;
}

export interface TrunksModel extends Trunks, Document{}

const prepSchema:Schema = new Schema({
    trunk_name:{
        type:String,
        required:"trunk_name is Required"
    },
    description:{
        type:String,
        required:"description is Required"
    },
    secret:{
        type:String,
        required:"secret is Required"
    },
    authentication:{
        type:String,
        required:"authentication is Required"
    },
    registration:{
        type:String,
        required:"registration is Required"
    },
    sip_server:{
        type:String,
        required:"sip_server is Required"
    },  
    sip_server_port:{
        type:String,
        required:"sip_server_port is Required"
    },
    context:{
        type:String,
        required:"context is Required"
    },
    transport:{
        type:String,
        required:"transport is Required"
    },
    is_deleted: {
        type: Number,
        enum:[0,1],
        default:0
    },
}, {
    timestamps: true
})

export default mongoose.model<TrunksModel>("trunks", prepSchema);