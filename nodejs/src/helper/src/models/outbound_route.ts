import mongoose,{ Schema,Document } from "mongoose";

export interface OutboundRoute{
    prepend:String;
    prefix:String;
    match_pattern:String;
    selected_trunk:any;
    is_deleted:Number;
}

export interface OutboundRouteModel extends OutboundRoute, Document{}

const prepSchema:Schema = new Schema({
    prepend:{
        type:String,
        required:"prepend is required"
    },
    prefix:{
        type:String,
        required:"prefix is required"
    },
    match_pattern:{
        type:String,
        required:"match_pattern is required"
    },
    selected_trunk:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "trunks",
        required:"selected_trunk is required"
    },
    is_deleted:{
        type:Number,
        default:0
    },
}, {
    timestamps: true
})

export default mongoose.model<OutboundRouteModel>("outbound_route", prepSchema);