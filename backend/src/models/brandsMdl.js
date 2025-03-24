/*
Fields:
brandName
*/
import { Schema,model } from "mongoose";

const brandsSchema = new Schema({
    brandName:{
        type:String,
        required: true
    }
},{ timestamps:true,
    strict: false
})

export default model("brands",brandsSchema)