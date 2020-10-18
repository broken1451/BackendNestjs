import { Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PcDTO } from './dateTransfersObj/pc.dto';
import { Request, Response } from 'express';
import * as FileSystem from 'fs';
import * as mongoose from 'mongoose';

@Injectable()
export class PcService {
  constructor(@InjectModel('pcs') public pcModel: mongoose.Model<any>) {} // injectar el modelo en esta clase

  async getAllUser(): Promise<any> {
    const pcs = await this.pcModel.find({}).exec();
    return pcs;
  }


  async createPc(pc: PcDTO): Promise<any> {
    try {
      //   async createUser(usuario: any):  Promise<any> {
    //  pc.user = pc.user
    //     console.log(pc.user)
      const pcs = await this.pcModel.create(pc);
      // const user = new this.userModel(usuario);
      await pcs.save();
      return pcs;
    } catch (error) {
      let res: Response;
      console.log({ error });
      return res.status(401).json({
        ok: false,
        error,
      });
    }
  }


  async updatePc(id: string, pc: any): Promise<any> {
    try {
      //   async createUser(usuario: any):  Promise<any> {
      const pcs = await this.pcModel.findByIdAndUpdate(id, pc, {
        new: true,
      });
      return pcs;
    } catch (error) {
      console.log({ error });
    }
  }

  async deletePc(id: string): Promise<any> {
    try {
      //   async createUser(usuario: any):  Promise<any> {
      const pc = await this.pcModel.findByIdAndRemove(id);
      return pc;
    } catch (error) {
      console.log({ error });
    }
  }


  async uploadImgUser(tipoImagen, id, nombreImagenPersonalizado,res): Promise<any> {
    try {
      //   async createUser(usuario: any):  Promise<any> {
      // const user =  await this.subirImagenPorTipo(tipoImagen, id, nombreImagenPersonalizado, res);
    //   const user = await this.subirImagenPorTipo(
    //     tipoImagen,
    //     id,
    //     nombreImagenPersonalizado,
    //     res,
    //   );
    //   return user;
    } catch (error) {
      console.log({ error });
    }
  }


  async subirImagenPorTipo(tipoImagen, id, nombreImagenPersonalizado, res) {
    if (tipoImagen == 'usuario') {
      console.log('ACA');

      try {
        this.pcModel.findById(id, (err, usuario) => {
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
