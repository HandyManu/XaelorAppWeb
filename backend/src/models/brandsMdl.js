import { Schema,model } from "mongoose";

const brandsSchema = new Schema({
    brandName:{
        type:String,
        required: true
    }
},{ timestamps:true,
    statics:false
})

export default model("Brands",brandsSchema)