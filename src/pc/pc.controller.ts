import { PcService } from './pc.service';
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

@Controller('pc')
export class PcController {

    constructor(private pcService: PcService) {}

    @Get('/')
    async getAllUsers(@Req() req, @Res() res) {
      const pcs = await this.pcService.getAllUser();
      return res.status(HttpStatus.OK).json({
        ok: true,
        menssage: 'funciona',
        pcs,
      });
    }

    @Post('/create') //localhost:3001/user/create
    async createUser(@Req() req, @Res() res, @Body() pc: any) {
      try {
        pc.user = req.user._id;
        const payload: any = {
            nameModel: pc.nameModel,
            img: pc.img,
            type: pc.type,
            usuario: pc.user
        };

        const pcCreated =  await this.pcService.createPc( payload )
        console.log(pcCreated)
        return res.status(HttpStatus.OK).json({
          ok: true,
          menssage: 'funciona',
          pcCreated
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
    async updateUser(@Req() req, @Res() res, @Body() pc: any, @Param('id') id: string) {
      // console.log({req, res})
      try {

        const pcUpdate = await this.pcService.updatePc(id, pc);
  
        return res.status(HttpStatus.OK).json({
          ok: true,
          menssage: 'funciona',
          // user,
          pcUpdate
        });
      } catch (error) {
        throw new NotFoundException(
          'No se pudo Actualizar a la base de datos el computador ingresado',
        );
      }
    }
  


  @Delete('/delete/:id')
  async deleteUser(@Req() req, @Res() res, @Param('id') id: string) {
    // console.log({req, res})
    try {
      const pcDeleted = await this.pcService.deletePc(id);
      if (!pcDeleted) {
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
            pcDeleted,
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
       const tipoImagenesValidos = ['pc'];
       if (tipoImagenesValidos.indexOf(tipoImagen) < 0) {
         return res.status(400).json({
           ok: false,
           mensaje: 'tipo de coleccion no valida',
           errors: {
             message:
               'tipo de coleccion no valida solo son permitidas pc',
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
 
       const path = `/home/muho/Documents/nestJs/invertario/dist/pc/uploads/${tipoImagen}/${nombreImagenPersonalizado}`;
       
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
 
       const pcUpdate: any = await this.pcService.subirImagenPorTipo( tipoImagen, id, nombreImagenPersonalizado,res);
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
