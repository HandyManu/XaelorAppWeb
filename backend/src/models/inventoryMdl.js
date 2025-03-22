import { Schema,model } from "mongoose";

const inventorySchema = new Schema({
    watchId:{
        type:Schema.Types.ObjectId,
        ref:"watches",
        required: true
    },
    brandId:{
        type:Schema.Types.ObjectId,
        ref:"brands",
        required: true
    },
    rating:{
        type:Number,
        required: true
    }
},{ timestamps:true,
    strict: false
})

export default model("inventory",inventorySchema)