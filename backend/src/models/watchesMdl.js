import { Schema, model } from "mongoose";

const watchSchema = new Schema({
    model: {
        type: String,
        required: true
    },
    brandId: {
        type: Schema.Types.ObjectId,
        ref: "Brands",
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
    statics: false
})

export default model("Watches", watchSchema)

