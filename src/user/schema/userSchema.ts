import * as mongoose from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';



export const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'El nombre es necesario y unico'] },
  img: { type: String, default: '' },
  email: {
    type: String,
    unique:true,
    required: [true, 'El correo es necesario y unico'],
  },
  password: { type: String, required: [true, 'La clave esnecesaria'] },
  created: { type: Date, default: Date.now}
});

 // Usar Plugin para validar 
    // usuarioSchema.plugin(uniqueValidator, {message: 'El correo debe ser unico'});
// userSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'});
userSchema.plugin<any>(uniqueValidator, {message: '{PATH} debe ser unico'})
