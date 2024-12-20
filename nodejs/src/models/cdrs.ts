import mongoose, { Schema, Document } from "mongoose";

interface cdrs {
    xml_cdr_uuid: String;
    domain_name: String;
    domain_uuid: String;
    sip_call_id: String;
    extension_uuid: String;
    direction: String;
    caller_id_name: String;
    caller_id_number: String;
    destination_number: String;
    start_stamp: String;
    duration: String;
    record_name: String;
    status: String;
    hangup_cause: String;
    module_name: String;
    recording_url: String;
}

export interface cdrsModel extends cdrs, Document { }

const prepSchema: Schema = new Schema(
    {
        xml_cdr_uuid: {
            type: String,
            default: null,
        },
        domain_name: {
            type: String,
            require: true,
        },
        domain_uuid: {
            type: String,
            require: true,
        },
        sip_call_id: {
            type: String,
            require: true,
        },
        extension_uuid: {
            type: String,
            require: true,
        },
        direction: {
            type: String,
            require: true,
        },
        caller_id_name: {
            type: String,
            require: true,
        },
        caller_id_number: {
            type: String,
            require: true,
        },
        destination_number: {
            type: String,
            require: true,
        },
        start_stamp: {
            type: String,
            require: true,
        },
        duration: {
            type: String,
            require: true,
        },
        record_name: {
            type: String,
            require: true,
        },
        status: {
            type: String,
            require: true,
        },
        hangup_cause: {
            type: String,
            require: true,
        },
        module_name: {
            type: String,
            require: true,
        },
        recording_url: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<cdrsModel>("cdr", prepSchema);
