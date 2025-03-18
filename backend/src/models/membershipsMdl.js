/**
 * Fields:
 * clientId
 * membershipTier
 * price
 * benefits
 * startDate
 * discount
 */

import { Schema, model } from "mongoose";

const MembershipSchema = new Schema({
   clientId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "ClientId is required"]
   },
   membershipTier: {
      type: String,
      required: [true, "membershipTier is required"],
      enum: {
         values: ['Bronze', 'Plata', 'Oro'],
         message: '{VALUE} is not a valid membership tier'
      }
   },
   price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "price cannot be less than 0"],
   },
   benefits: [{
      type: String,
      validate: {
         validator: function (v) {
            return v.length > 0;
         },
         message: "At least one benefit is required"
      }
   }],
   startDate: {
      type: Date,
      required: [true, "startDate is required"],
      validate: {
         validator: function (v) {
            return v >= new Date();
         },
         message: "The start date must be greater than or equal to the current date"
      }
   },
   discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be less than 0%"],
      max: [1, "El descuento no puede ser mayor al 100%"]
   }
},
   {
      timestamps: true,
      strict: false
   });

export default model('membershipsMdl', MembershipSchema);