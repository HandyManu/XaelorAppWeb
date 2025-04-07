/*
Fields:
customerId
employeeId
address
reference
status
selectedPaymentMethod
total
selectedProducts
        watchId
        quantity
        subtotal
*/

import { Schema, model } from "mongoose";

const salesSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "customers",
        required: [true, "Client ID is required"]
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: "employees", 
        required: true
    },
    address: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true
    },
    selectedPaymentMethod: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    selectedProducts: [{
        watchId: {
            type: Schema.Types.ObjectId,
            ref: 'watches',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        subtotal: {
            type: Number,
            required: true
        }
    }]
}, {
    timestamps: true,
    strict: false
});

export default model("sales", salesSchema);