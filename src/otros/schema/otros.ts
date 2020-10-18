import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
// import * as uniqueValidator from 'mongoose-unique-validator';



export const otrosSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'El nombre es necesario y unico'] },
  img: { type: String, default: '' },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: [
      true,
      "Debe de existir una referencia al users, campo obligatorio",
    ],
  },
  created: { type: Date, default: Date.now}
});

 // Usar Plugin para validar 
    // usuarioSchema.plugin(uniqueValidator, {message: 'El correo debe ser unico'});
// userSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'});
// pcSchema.plugin<any>(uniqueValidator, {message: '{PATH} debe ser unico'})
export const Otros = mongoose.model<any>("otros", otrosSchema);
// module.exports =  mongoose.model('users', userSchema);
