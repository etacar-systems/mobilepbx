import mongoose,{ Schema,Document } from "mongoose";

export interface RingGroup{
    ring_group_name:String;
    ring_group_description:String;
    ring_group_phone_number:String;
    ring_group_duration:Number;
    select_extensions:any;
    isenable_music_on_hold:Number;
    isenable_skip_busy_agent:Number;
    isenable_remote_call_pickup:Number;
    ring_group_strategy:Number;
    remote_no_answer:Number;
    no_answer_endpoint:Number;
    is_deleted:Number;
}

export interface RingGroupModel extends RingGroup, Document{}

const prepSchema:Schema = new Schema({
    ring_group_name:{
        type:String,
        required: "Ring Group Name is required"
    },
    ring_group_description:{
        type:String,
        required: "Ring Group Description is required"
    },
    ring_group_phone_number:{
        type:String,
        required: "Ring Group PhoneNumber is required"
    },
    ring_group_duration:{
        type:Number,
        default:0
    },
    select_extensions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "extension",
        default:null
    }],
    isenable_music_on_hold:{
        type:Number,
        enum:[0,1],
        default:0
    },
    isenable_skip_busy_agent:{
        type:Number,
        enum:[0,1],
        default:0
    },
    isenable_remote_call_pickup:{
        type:Number,
        enum:[0,1],
        default:0
    },
    ring_group_strategy:{
        type:Number,
        enum:[1,2], // 1 for Ring All 2 for Hunt
        require: true
    },
    remote_no_answer:{
        type:Number,
        enum:[1,2,3,4], // 1 for ivr 2 for Hunt Ring group 3 for Time condition 4 Extantion
        require: true
    },
    no_answer_endpoint:{
        type:Number,
        enum:[1], // 1 for Target
        require: true
    },
    is_deleted:{
        type:Number,
        default:0
    },
}, {
    timestamps: true
})

export default mongoose.model<RingGroupModel>("ring_group", prepSchema);