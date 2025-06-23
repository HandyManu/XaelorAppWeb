/*
fields:
watchId
branchId
stock
movements
*/
import { Schema, model } from "mongoose";

const inventorySchema = new Schema(
    {
        watchId: { type: Schema.Types.ObjectId, ref: 'watches' },
        branchId: { type: Schema.Types.ObjectId, ref: 'branches' },
        stock: {
            type: Number,
            required: true,
            default: 0
        },
        movements: [{
            type: {
                type: String,
                enum: ['initial', 'add', 'subtract'],
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 0
            },
            notes: {
                type: String,
                default: ''
            },
            date: {
                type: Date,
                default: Date.now
            }
        }]
    }, {
    timestamps: true,
    strict: false
}
);

export default model('inventory', inventorySchema);