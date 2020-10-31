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
import { Usuario } from '../user/schema/userSchema';
import * as Path from 'path';

@Injectable()
export class UserService {
  constructor(@InjectModel('users') public userModel: mongoose.Model<any>) {} // injectar el modelo en esta clase
  // constructor(@InjectModel('user') public userModel: Model<UserInterface> ) {} // injectar el modelo en esta clase

  async getAllUser(): Promise<any> {
    const users = await this.userModel.find({},'_id name email img created').exec();
    const conutsUser = await this.userModel.countDocuments({});
    return { users,conutsUser};
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
        error,
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

  async uploadImgUser(tipoImagen, id, nombreImagenPersonalizado,res): Promise<any> {
    try {
      //   async createUser(usuario: any):  Promise<any> {
      // const user =  await this.subirImagenPorTipo(tipoImagen, id, nombreImagenPersonalizado, res);
      const user = await this.subirImagenPorTipo(
        tipoImagen,
        id,
        nombreImagenPersonalizado,
        res,
      );
      return user;
    } catch (error) {
      console.log({ error });
    }
  }

  async login(email: string): Promise<any> {
    try {
      //   async createUser(usuario: any):  Promise<any> {
      const userLogin = await this.userModel.findOne({ email: email });
      return userLogin;
    } catch (error) {
      console.log({ error });
    }
  }

  async subirImagenPorTipo(tipoImagen, id, nombreImagenPersonalizado, res) {
    if (tipoImagen == 'usuario') {
      console.log('ACA');

      try {
        this.userModel.findById(id, (err, usuario) => {
          // console.log('USER ====>>> ', usuario);
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al subir Imagen',
              errors: err,
            });
          }

          if (!usuario) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error el usuario con ese id no existe',
              errors: err,
            });
          }
          if (usuario.img === '' || !usuario.img ) {
            usuario.img = nombreImagenPersonalizado ;
          } 
          console.log({usuario, img: usuario.img })
          const pathViejo ='/home/muho/Documents/nestJs/invertario/dist/user/uploads/usuario/' + usuario.img; // pathViejo de la imagen si el usuario ya tiene una guardada
          if (FileSystem.existsSync(pathViejo)) {  // si existe elimina la imagen anterior
            FileSystem.unlink(pathViejo,(err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error en path la img para ese usuario no existe",
                        errors: err
                    });
                }
            });
        }


          usuario.img = nombreImagenPersonalizado;
          usuario.save((err, usuarioActualizado) => {
            console.log({ usuarioActualizado });
            if (err) {
              return res.status(400).json({
                ok: false,
                mensaje: 'Error al subir imagen de usuario',
                errors: err,
              });
            }
            usuarioActualizado.password = ':)';
            return res.status(200).json({
              ok: true,
              mensaje: 'Imagen de usuario actualizada ',
              usuarioActualizado: usuarioActualizado,
            });
          });
        });
      } catch (error) {
        console.log({ error });
      }
    }
  }
}
