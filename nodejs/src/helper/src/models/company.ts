import mongoose,{ Schema,Document } from "mongoose";

export interface Company{
    company_name:String;
    company_street_address:String;
    company_zipcode:String;
    company_city:String;
    company_country:String;
    company_vat:String;
    company_contact_person:String;
    company_password: String;
    company_email:String;
    company_phone_number:String;
    is_deleted:Number;
    assigned_pstn_pool:String;
}

export interface CompanyModel extends Company, Document{}

const prepSchema:Schema = new Schema({
    company_name: {
        type: String,
        default: ""
    },
    company_street_address:{
        type: String,
        default: ""
    },
    company_zipcode:{
        type: String,
        default: ""
    },
    company_city:{
        type: String,
        default: ""
    },
    company_country:{
        type: String,
        default: ""
    },
    company_vat:{
        type: String,
        default: ""
    },
    company_contact_person:{
        type: String,
        default: ""
    },
    company_password: {
        type: String,
        required: "company_password is required"
    },
    company_email: {
        type: String,
        default: ""
    },
    company_phone_number: {
        type: String,
        default: ""
    },
    is_deleted: {
        type: Number,
        enum:[0,1],
        default:0
    },
    isassign_pstn:{
        type: Number,
        enum:[0,1],
        default:0
    },
    assigned_pstn_pool:{
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

export default mongoose.model<CompanyModel>("company", prepSchema);