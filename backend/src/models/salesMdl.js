/*
Fields:
idClient
employeeId
address
reference
status
selectedPaymentMethod
total
selectedProducts
        idWatch
        quantity
        subtotal
*/

import { Schema, model } from "mongoose";

const salesSchema = new Schema({
    idClient: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    employeeId: {
       type: Schema.Types.ObjectId,
        ref: 'employees',
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
        enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    selectedPaymentMethod: {
        type: String,
        enum: ['Credit Card', 'PayPal', 'Bank Transfer'],
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    selectedProducts: [{
        idWatch: {
            type: Schema.Types.ObjectId,
            ref: 'Watches',
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