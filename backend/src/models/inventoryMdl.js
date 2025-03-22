import { Schema,model } from "mongoose";



const inventorySchema = new Schema({
    watchId:{
        type:Schema.Types.ObjectId,
        ref:"Watches",
        required: true
    },
    branchId:{
        type:Schema.Types.ObjectId,
        ref:"Branch",
        required: true
    },
    stock:{
        type:Number,
        required: true
    }
},{ timestamps:true,
    strict: false
})

export default model("inventory",inventorySchema)