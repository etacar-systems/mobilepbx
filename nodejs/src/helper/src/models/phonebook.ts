import mongoose, { Document, Schema } from "mongoose";

export interface Phonebook{
        first_name : String,
        last_name : String,
        phone_number : String,
        mobile_number :String,
        company :String,
        position :String
}

export interface PhonebookModal extends Phonebook , Document {}

const phonebookSchema : Schema = new Schema ({
        first_name : {
                type : String,
                requried: "First name is requried"
        },
        last_name : {
                type : String,
                requried: "Last name is requried"
        },
        phone_number : {
                type : String,
                requried: "Phone number is requried"
        },
        mobile_number : {
                type : String,
                requried: "Mobile nunmber is requried"
        },
        company : {
                type : String,
                requried: "Comapany is requried"
        },
        position : {
                type : String,
                requried: "Position is requried"
        },
        is_deleted : {
                type: Number,
                enum: [0, 1],
                default: 0
        }
},
{
        timestamps: true
})


export default mongoose.model<PhonebookModal>("phonebook",phonebookSchema)

