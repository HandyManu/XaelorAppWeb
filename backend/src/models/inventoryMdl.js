/*
fields:
watchId
branchId
stock
*/
import { Schema, model } from "mongoose";

const inventorySchema = new Schema(
    {
        watchId: { type: Schema.Types.ObjectId, ref: 'watches' },
        branchId: { type: Schema.Types.ObjectId, ref: 'branches' },
        stock: {
            type: Number,
            required: true
        }
    }, {
    timestamps: true,
    strict: false, collection: 'inventory'
}
);

export default model('inventory', inventorySchema);
