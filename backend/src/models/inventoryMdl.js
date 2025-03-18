import { Schema,model } from "mongoose";

const inventorySchema = new Schema({
    watchId:{
        type:Schema.Types.ObjectId,
        ref:"costumers",
        required: true
    },
    branchId:{
        type:Schema.Types.ObjectId,
        ref:"costumers",
        required: true
    },
    rating:{
        type:Number,
        required: true
    }
},{ timestamps:true,
    statics:false
})

export default model("Inventory",inventorySchema)