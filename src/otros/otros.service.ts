import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as FileSystem from 'fs';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OtrosDTO } from './dateTransfersObj/otros.dto';

@Injectable()
export class OtrosService {
    constructor(@InjectModel('otros') public otrosModel: mongoose.Model<any>) {}

    async getAllOtros(): Promise<any> {
        const otros = await this.otrosModel.find({}).exec();
        return otros;
    }

    async createOtros(otro: OtrosDTO ): Promise<any> {
        try {
          const otros = await this.otrosModel.create(otro);
          // const user = new this.userModel(usuario);
          await otros.save();
          return otros;
        } catch (error) {
          let res: Response;
          console.log({ error });
          return res.status(401).json({
            ok: false,
            error,
          });
        }
      }

      async updateOtros(id: string, otro: any): Promise<any> {
        try {
          //   async createUser(usuario: any):  Promise<any> {
          const otros = await this.otrosModel.findByIdAndUpdate(id, otro, {
            new: true,
          });
          return otros;
        } catch (error) {
          console.log({ error });
        }
      }
    
      async deleteOtros(id: string): Promise<any> {
        try {
          //   async createUser(usuario: any):  Promise<any> {
          const otros = await this.otrosModel.findByIdAndRemove(id);
          return otros;
        } catch (error) {
          console.log({ error });
        }
      }
    
      async uploadImgUser(tipoImagen, id, nombreImagenPersonalizado,res): Promise<any> {
        try {
          //   async createUser(usuario: any):  Promise<any> {
          // const user =  await this.subirImagenPorTipo(tipoImagen, id, nombreImagenPersonalizado, res);
          const pcs = await this.subirImagenPorTipo( tipoImagen, id, nombreImagenPersonalizado, res );
          return pcs;
        } catch (error) {
          console.log({ error });
        }
      }

      async subirImagenPorTipo(tipoImagen, id, nombreImagenPersonalizado, res) {
        if (tipoImagen == 'otros') {
          console.log('ACA');
          try {
            this.otrosModel.findById(id, (err, usuario) => {
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
              const pathViejo ='/home/muho/Documents/nestJs/invertario/dist/otros/uploads/otros/' + usuario.img; // pathViejo de la imagen si el usuario ya tiene una guardada
              
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
              usuario.save((err, otrosImgActualizado) => {
                // console.log({ pcImgActualizado });
                if (err) {
                  return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al subir imagen de usuario',
                    errors: err,
                  });
                }
                otrosImgActualizado.password = ':)';
                return res.status(200).json({
                  ok: true,
                  mensaje: 'Imagen de otros actualizada ',
                  otrosImgActualizado: otrosImgActualizado,
                });
              });
            });
          } catch (error) {
            console.log({ error });
          }
        }
      }
    
}
