/*
Fields:
name
email
password
phone
branchId
position
salary
*/

import { Schema, model } from "mongoose";

const employeesSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede exceder los 50 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, ingrese un correo electrónico válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
    },
    phone: {
        type: String,
        required: [true, 'El número de teléfono es obligatorio'],
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
               // This regex allows for various phone number formats
               return /^[\d\s\-()]+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number`
         }
    },
    branchId: {
        type: Schema.Types.ObjectId,
        ref: "Branches",
        required: [true, 'El ID de la sucursal es obligatorio']
    },
    position: {
        type: String,
        required: [true, 'El puesto es obligatorio'],
        trim: true,
        minlength: [2, 'El puesto debe tener al menos 2 caracteres'],
        maxlength: [50, 'El puesto no puede exceder los 50 caracteres']
    },
    salary: {
        type: Number,
        required: [true, 'El salario es obligatorio'],
        min: [0, 'El salario no puede ser negativo']
    }
}, {
    timestamps: true,
    strict: false

});

export default model("employees", employeesSchema);