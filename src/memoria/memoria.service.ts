import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as FileSystem from 'fs';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MemoriaDTO } from './dateTransfersObj/memoria.dto';

@Injectable()
export class MemoriaService {

    constructor(@InjectModel('memorias') public memoriasModel: mongoose.Model<any>) {}

    async getAllMemorys(): Promise<any> {
        const memory = await this.memoriasModel.find({}).exec();
        return memory;
    }


    async createMemoria(memoria: MemoriaDTO ): Promise<any> {
        try {
          const memory = await this.memoriasModel.create(memoria);
          await memory.save();
          return memory;
        } catch (error) {
          let res: Response;
          console.log({ error });
          return res.status(401).json({
            ok: false,
            error,
          });
        }
    }

    async updateMemory(id: string, memoria: any): Promise<any> {
        try {
          const memory = await this.memoriasModel.findByIdAndUpdate(id, memoria, {
            new: true,
          });
          return memory;
        } catch (error) {
          console.log({ error });
        }
      }
    
      async deleteMemory(id: string): Promise<any> {
        try {
          //   async createUser(usuario: any):  Promise<any> {
          const memory = await this.memoriasModel.findByIdAndRemove(id);
          return memory;
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
        if (tipoImagen == 'memoria') {
          console.log('ACA');
          try {
            this.memoriasModel.findById(id, (err, usuario) => {
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
              const pathViejo ='/home/muho/Documents/nestJs/invertario/dist/memoria/uploads/memoria/' + usuario.img; // pathViejo de la imagen si el usuario ya tiene una guardada
              
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
              usuario.save((err, memoryImgActualizado) => {
                // console.log({ pcImgActualizado });
                if (err) {
                  return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al subir imagen de usuario',
                    errors: err,
                  });
                }
                memoryImgActualizado.password = ':)';
                return res.status(200).json({
                  ok: true,
                  mensaje: 'Imagen de otros actualizada ',
                  memoryImgActualizado: memoryImgActualizado,
                });
              });
            });
          } catch (error) {
            console.log({ error });
          }
        }
      }

}
