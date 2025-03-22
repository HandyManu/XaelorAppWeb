/*
Fields:
branch_name
country
address   
phone_number
business_hours
        day
        open
        close
*/

import { Schema, model } from "mongoose";

const branchesSchema = new Schema({
    branch_name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true,
        unique: true
    },
    business_hours: [{
        day: {
            type: String,
            required: true
        },
        open: {
            type: String,
            required: true
        },
        close: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true,
    strict: false
});

export default model("Branch", branchesSchema);
