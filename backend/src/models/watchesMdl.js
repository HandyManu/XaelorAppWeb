/*
Fields:
model
brandId
price
category
description
photos
availability
*/

import { Schema, model } from "mongoose";

const watchSchema = new Schema({
    model: {
        type: String,
        required: true
    },
    brandId: {
        type: Schema.Types.ObjectId,
        ref: "brands",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photos: {
        type: [String],
        required: true,
    },
    availability: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true,
    strict: false
})

export default model("watches", watchSchema)

