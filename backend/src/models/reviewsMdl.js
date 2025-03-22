import { Schema,model } from "mongoose";

const reviewSchema = new Schema({
    watchId:{
        type:Schema.Types.ObjectId,
        ref:"watches",
        required: true
    },
    customerId:{
        type:Schema.Types.ObjectId,
        ref:"customers",
        required: true
    },
    message: {
        type: String,
        required: true,
        unique: true
    },
    rating:{
        type:Number,
        required: true,
        min: 0,
        max:1
    },
    date: {
        type: Date,
        required: true,
     },
},{ timestamps:true,
    strict: false
})

export default model("reviews",reviewSchema)