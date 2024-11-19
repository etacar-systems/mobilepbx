import mongoose,{ Schema,Document } from "mongoose";

export interface PstnNumber{
    provider:String;
    cid:String;
    pstn_number:String;
    isassigned:Number;
    assigend_extensionId:String
    is_deleted:Number;
}

export interface PstnNumberModel extends PstnNumber, Document{}

const prepSchema:Schema = new Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "trunks",
        default:null
    },
    cid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company",
        default:null
      },
      pstn_number: {
        type: String,
        required: "pstn_number is required"
    },
    isassigned:{
        type: Number,
        enum:[0,1],
        default:0
    },
    assigend_extensionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "extension",
        default:null
    },
    is_deleted: {
        type: Number,
        enum:[0,1],
        default:0
    }
}, {
    timestamps: true
})

export default mongoose.model<PstnNumberModel>("pstn_number", prepSchema);