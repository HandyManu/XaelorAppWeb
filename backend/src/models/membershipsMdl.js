/**
 * Fields:
 * membershipTier
 * price
 * benefits
 * discount
 */

import { Schema, model } from "mongoose";

const MembershipSchema = new Schema({
   membershipTier: {
      type: String,
      required: [true, "membershipTier is required"]
      
   },
   price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "price cannot be less than 0"],
   },
   benefits: {
      type: String,
      validate: {
         validator: function (v) {
            return v.length > 0;
         },
         message: "At least one benefit is required"
      }
   },
   discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be less than 0%"],
      max: [0.5, "El descuento no puede ser mayor al 50%"]
   }
},
   {
      timestamps: true,
      strict: false
   });

export default model('memberships', MembershipSchema);