import mongoose, { Document, Schema } from "mongoose";

export interface Firewall {
        network: String,
        add_assign_zone: String,
        company_select: String,
        description: String,
        is_deleted: Number

}

export interface FirewallModal extends Firewall, Document { }

const firewallSchema: Schema = new Schema({
        company_select: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "company",
                default: null
        },
        add_assign_zone: {
                type: Number,
                enum: [1, 2], //1 for internat 2 for local 
                requried: "Add asign zone is requried"

        },
        network: {
                type: String,
                requried: "Network is requried"
        },
        description: {
                type: String,
                requried: "description is requried"
        },
        is_deleted: {
                type: Number,
                enum: [0, 1],
                default: 0
        },
}, {
        timestamps: true
})

export default mongoose.model<FirewallModal>('firewall', firewallSchema)

