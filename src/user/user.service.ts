import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { UserInterface } from './interfaces/user.interfaces';
import { UserDTO } from './dateTransfersObj/user.dto';
import { userSchema } from './schema/userSchema';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import * as FileSystem from 'fs';
import { Usuario } from '../user/schema/userSchema'

@Injectable()
export class UserService {
  constructor(@InjectModel('users') public userModel: mongoose.Model<any>) {} // injectar el modelo en esta clase
  // constructor(@InjectModel('user') public userModel: Model<UserInterface> ) {} // injectar el modelo en esta clase

  async getAllUser(): Promise<any> {
    const users = await this.userModel.find({}).exec();
    return users;
  }

  async createUser(usuario: UserDTO): Promise<any> {
    try {
      //   async createUser(usuario: any):  Promise<any> {
      const user = await this.userModel.create(usuario);
      // const user = new this.userModel(usuario);
      await user.save();
      return user;
    } catch (error) {
       let res: Response;
      console.log({ error });
      return res.status(401).json({
        ok: false,
        error
      });
    }
  }

  async updateUser(id: string, usuario: any): Promise<any> {
    try {
      //   async createUser(usuario: any):  Promise<any> {
      const user = await this.userModel.findByIdAndUpdate(id, usuario, {
        new: true,
      });
      return user;
    } catch (error) {
      console.log({ error });
    }
  }

  async deleteUser(id: string): Promise<any> {
    try {
      //   async createUser(usuario: any):  Promise<any> {
      const user = await this.userModel.findByIdAndRemove(id);
      return user;
    } catch (error) {
      console.log({ error });
    }
  }

  async uploadImgUser(tipoImagen, id, nombreImagenPersonalizado, res): Promise<any> {
    try {
      //   async createUser(usuario: any):  Promise<any> {
      const user =  await this.subirImagenPorTipo(tipoImagen, id, nombreImagenPersonalizado, res); 
      return user;
    } catch (error) {
      console.log({ error });
    }
  }

  async login(email: string): Promise<any> {
    try {
      //   async createUser(usuario: any):  Promise<any> {
      const userLogin = await this.userModel.findOne({email: email});
      return userLogin;
    } catch (error) {
      console.log({ error });
    }
  }

  // async subirImagenPorTipo(tipoImagen: string, id: string, nombreImagenPersonalizado: string, res: Response) {
  //     if(tipoImagen == 'usuario'){
  //       this.userModel.findById(id,(err,imgUser) => {
  //         if (err) {
  //           return  res.status(500).json({
  //               ok: false,
  //               mensaje: "Error al subir Imagen",
  //               errors: err
  //           });
  //         }

  //         if (!imgUser) {
  //           return  res.status(500).json({
  //                 ok: false,
  //                 mensaje: "Error el usuario con ese id no existe",
  //                 errors: err
  //             });
  //         }

  //         var pathViejo = '/home/muho/Documents/nestJs/invertario/dist/uploads/usuario' + imgUser.img; 
  //           if (FileSystem.existsSync(pathViejo)) {  // si existe elimina la imagen anterior
  //             FileSystem.unlink(pathViejo,(err) => {
  //                 if (err) {
  //                     return res.status(500).json({
  //                         ok: false,
  //                         mensaje: "Error en path",
  //                         errors: err
  //                     });
  //                 }
  //             });
  //         }
  
  //         imgUser.img = nombreImagenPersonalizado;
  //         imgUser.save((err, usuarioActualizado) => {
  //           if (err) {
  //             return res.status(400).json({
  //                 ok: false,
  //                 mensaje: "Error al subir imagen de usuario",
  //                 errors: err
  //             });
  //           }
  //           usuarioActualizado.password = ':)';
  //           return res.status(200).json({
  //             ok: true,
  //             mensaje: "Imagen de usuario actualizada ",
  //             usuarioActualizado: usuarioActualizado
  //           });
  //         })
  //       });

  //     }


  // }


 subirImagenPorTipo(tipoImagen, id, nombreImagenPersonalizado, res) {
  if(tipoImagen == 'usuario'){
    console.log("ACA")
    this.userModel.findById(id, (err, usuario) => {
          if (err) {
            return  res.status(500).json({
                ok: false,
                mensaje: "Error al subir Imagen",
                errors: err
            });
        }
    
        if (!usuario) {
            return  res.status(500).json({
                  ok: false,
                  mensaje: "Error el usuario con ese id no existe",
                  errors: err
              });
          }
        
        var pathViejo = '/home/muho/Documents/nestJs/invertario/dist/uploads/usuario/' + usuario.img; // pathViejo de la imagen si el usuario ya tiene una guardada 
        console.log({pathViejo, user:  usuario.img, usuario: usuario})
          if (FileSystem.existsSync(pathViejo)) {  // si existe elimina la imagen anterior
            FileSystem.unlink(pathViejo,(err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error en path",
                        errors: err
                    });
                }
            });
        }
    
        usuario.img = nombreImagenPersonalizado;
        usuario.save((err, usuarioActualizado) => {
          if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al subir imagen de usuario",
                errors: err
            });
        }
        usuarioActualizado.password = ':)';
        return res.status(200).json({
            ok: true,
            mensaje: "Imagen de usuario actualizada ",
            usuarioActualizado: usuarioActualizado
          });
      });
    
    
    });
  }



}

}

// export function subirImagenPorTipo(tipoImagen, id, nombreImagenPersonalizado, res) {
//   if(tipoImagen == 'usuario'){
//     this..findById(id, (err, usuario) => {
//           if (err) {
//             return  res.status(500).json({
//                 ok: false,
//                 mensaje: "Error al subir Imagen",
//                 errors: err
//             });
//         }
    
//         if (!usuario) {
//             return  res.status(500).json({
//                   ok: false,
//                   mensaje: "Error el usuario con ese id no existe",
//                   errors: err
//               });
//           }
        
//         var pathViejo = '/home/muho/Documents/nestJs/invertario/dist/uploads/usuario/' + usuario.img; // pathViejo de la imagen si el usuario ya tiene una guardada 
//         console.log({pathViejo})
//           if (FileSystem.existsSync(pathViejo)) {  // si existe elimina la imagen anterior
//             FileSystem.unlink(pathViejo,(err) => {
//                 if (err) {
//                     return res.status(500).json({
//                         ok: false,
//                         mensaje: "Error en path",
//                         errors: err
//                     });
//                 }
//             });
//         }
    
//         usuario.img = nombreImagenPersonalizado;
//         usuario.save((err, usuarioActualizado) => {
//           if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: "Error al subir imagen de usuario",
//                 errors: err
//             });
//         }
//         usuarioActualizado.password = ':)';
//         return res.status(200).json({
//             ok: true,
//             mensaje: "Imagen de usuario actualizada ",
//             usuarioActualizado: usuarioActualizado
//           });
//       });
    
    
//     });
//   }



// }
