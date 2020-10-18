import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
// import * as uniqueValidator from 'mongoose-unique-validator';



export const pcSchema = new mongoose.Schema({
  nameModel: { type: String, required: [true, 'El nombre es necesario y unico'] },
  img: { type: String, default: '' },
  type: {type: String , default: ''},
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: [
      false,
      "Debe de existir una referencia al users, campo obligatorio",
    ],
  },
  created: { type: Date, default: Date.now}
});

 // Usar Plugin para validar 
    // usuarioSchema.plugin(uniqueValidator, {message: 'El correo debe ser unico'});
// userSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'});
// pcSchema.plugin<any>(uniqueValidator, {message: '{PATH} debe ser unico'})
export const Pcs = mongoose.model<any>("pcs", pcSchema);
// module.exports =  mongoose.model('users', userSchema);
