import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Res,
    Req,
    HttpStatus,
    Body,
    Param,
  } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import  * as FileSystem from 'fs';
import * as Path from 'path';
import { OtrosService } from './otros.service';

@Controller('otros')
export class OtrosController {
    constructor(private otrosService: OtrosService) {}


    @Get('/')
    async getAllOthers(@Req() req, @Res() res) {
      const otros = await this.otrosService.getAllOtros();
      return res.status(HttpStatus.OK).json({
        ok: true,
        menssage: 'funciona',
        otros,
      });
    }

    @Post('/create') //localhost:3001/user/create
    async createOthers(@Req() req, @Res() res, @Body() otro: any) {
      try {
        otro.user = req.user._id;
        const payload: any = {
            name: otro.name,
            img: otro.img,
            usuario: otro.user
        };

        const otrosCreated =  await this.otrosService.createOtros( payload )
        // console.log(pcCreated)
        return res.status(HttpStatus.OK).json({
          ok: true,
          menssage: 'funciona',
          otrosCreated
        //   pcCreated
        //   user: otro.user 
        });
      } catch (error) {
        console.log('error', error);
        // throw new NotFoundException('No se pudo agregar a la base de datos el usuario ingresado');
        return res.status(400).json({
          ok: false,
          error: {
            message: 'No se pudo agregar a la base de datos el computador ingresado',
            status: HttpStatus.BAD_REQUEST,
            // body,
          },
        });
      }
    }

    @Put('/update/:id')
    async updateOthers(@Req() req, @Res() res, @Body() otro: any, @Param('id') id: string) {
      // console.log({req, res})
      try {

        const otrosUpdate = await this.otrosService.updateOtros(id, otro);
  
        return res.status(HttpStatus.OK).json({
          ok: true,
          menssage: 'funciona',
          // user,
          otrosUpdate
        });
      } catch (error) {
        throw new NotFoundException(
          'No se pudo Actualizar a la base de datos el computador ingresado',
        );
      }
    }
  


  @Delete('/delete/:id')
  async deleteOthers(@Req() req, @Res() res, @Param('id') id: string) {
    // console.log({req, res})
    try {
      const otrosDeleted = await this.otrosService.deleteOtros(id);
      if (!otrosDeleted) {
        return res.status(HttpStatus.FOUND).json({
            ok: false,
            menssage: 'funciona',
            // user,
            pcDeleted: [],
          });
      } else {
          return res.status(HttpStatus.OK).json({
            ok: true,
            menssage: 'funciona',
            // user,
            otrosDeleted,
          });
      }
    } catch (error) {
      throw new NotFoundException(
        'No se pudo agregar a la base de datos el usuario ingresado',
      );
    }
  }


    // subir imagen a user
    @Put('/upload/:tipoImagen/:id')
    async uploadoImage(@Req() req, @Res() res: Response, @Body() user: any, @Param('id') id: string, @Param('tipoImagen') tipoImagen: string ) {
      try {
        const tipoImagenesValidos = ['otros'];
        if (tipoImagenesValidos.indexOf(tipoImagen) < 0) {
          return res.status(400).json({
            ok: false,
            mensaje: 'tipo de coleccion no valida',
            errors: {
              message:
                'tipo de coleccion no valida solo son permitidas otros',
            },
          });
        }
  
        if (!req.files) {
          return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' },
          });
        }
  
        // Obtener nombre del archivo
        const nombreArchivo = req.files.image; //imagen es el nombre que esta en el postman
        const nombreArchivoSeparado = nombreArchivo.name.split('.'); // separar en un arreglo el archivo para tener su extension
        const extensionArchivo = nombreArchivoSeparado[nombreArchivoSeparado.length - 1]; // obtener la extension del archivo
  
        // Extensiones permitidas
        const extensionesValida = ['png', 'jpg', 'gif', 'jpeg'];
        if (extensionesValida.indexOf(extensionArchivo) < 0) {
          return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: {
              message:
                'La extesion agregada no es permitida solo se admiten estas extensiones: ' +
                extensionesValida.join(','),
            },
          });
        }
  
        // Nombre de archivo personalizado
        const nombreImagenPersonalizado = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
  
        const path = `/home/muho/Documents/nestJs/invertario/dist/otros/uploads/${tipoImagen}/${nombreImagenPersonalizado}`;
        
        console.log(path)
        nombreArchivo.mv(path, err => {
          // console.log({ path });
          if (err) {
            console.log({ err });
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al mover archivo',
              errors: err,
            });
          }
        });
  
        // const otrosUpdate: any = await this.otrosService.subirImagenPorTipo( tipoImagen, id, nombreImagenPersonalizado,res);
     //    return res.json({
     //      ok: true,
     //      path
     //    })
      } catch (error) {
        console.log({ error });
        throw new NotFoundException('No se pudo agregar a la base de datos del pc ingresado');
      }
    }

}
