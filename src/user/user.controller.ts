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
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserInterface } from './interfaces/user.interfaces';
import Token from 'src/utils/token';
import  * as FileSystem from 'fs';
import * as fileUpload from 'express-fileupload';
import * as express from 'express';
import { Response } from 'express';
import * as Path from 'path';

import { comparPass } from 'src/utils/compararPass';

const app = express();
app.use(fileUpload());

@Controller('user')
export class UserController {
  // controlador vamos a manejar las rutas que vienen a nuestro servidor

  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(@Req() req, @Res() res) {
    const users = await this.userService.getAllUser();
    return res.status(HttpStatus.OK).json({
      ok: true,
      menssage: 'funciona',
      users,
    });
  }

  @Get('/img/:tipoImagen/:imagen')
  async getImgUser(@Res() res, @Param('tipoImagen') tipoImagen: string, @Param('imagen') imagen: string ) {
    try {
      const  pathImagen = Path.resolve(__dirname,`/home/muho/Documents/nestJs/invertario/dist/user/uploads/${tipoImagen}/${imagen}`); // Resolver el path para que siempre quede correcto, tipoImagen = usuarios / estudiantes, imagen = nombre de imagen
      // const  pathImagen1 = Path.resolve(__dirname,`../uploads/${tipoImagen}/${imagen}`); // Resolver el path para que siempre quede correcto, tipoImagen = usuarios / estudiantes, imagen = nombre de imagen
      console.log('pathImagen: ', pathImagen);
      if (FileSystem.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
      }  else {
        var pathNoImage = Path.resolve(__dirname,`../assets/no-img.jpg`);
        console.log('pathNoImage: ', pathNoImage);
        res.sendFile(pathNoImage);
      }  
      
    } catch (error) {
      console.log({error});
      return res.status(400).json({
        ok: false,
        error: {
          message: 'No existe imagen en la base de datos',
          error: 'La img para este usuario no existe',
          status: HttpStatus.BAD_REQUEST,
        }
      });
    }
  }



  @Post('/create') //localhost:3001/user/create
  async createUser(@Req() req, @Res() res, @Body() user: UserInterface) {
    try {
      user.password = bcrypt.hashSync(user.password, 10);
      console.log({ pass: bcrypt.hashSync(user.password, 10) });
      const userCreated: UserInterface = await this.userService.createUser( user );
      const token = Token.getJwtToken(userCreated);
      return res.status(HttpStatus.OK).json({
        ok: true,
        menssage: 'funciona',
        // user,
        userCreated,
        token,
      });
    } catch (error) {
      console.log('error', error);
      // throw new NotFoundException('No se pudo agregar a la base de datos el usuario ingresado');
      return res.status(400).json({
        ok: false,
        error: {
          message: 'No se pudo agregar a la base de datos el usuario ingresado',
          error: 'El email debe ser unico',
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  @Put('/update/:id')
  async updateUser(@Req() req, @Res() res, @Body() user: any, @Param('id') id: string) {
    // console.log({req, res})
    try {
      const userUpdate = await this.userService.updateUser(id, user);

      return res.status(HttpStatus.OK).json({
        ok: true,
        menssage: 'funciona',
        // user,
        userUpdate,
      });
    } catch (error) {
      throw new NotFoundException(
        'No se pudo agregar a la base de datos el usuario ingresado',
      );
    }
  }

  @Delete('/delete/:id') //localhost:3001/user/create
  async deleteUser(@Req() req, @Res() res, @Param('id') id: string) {
    // console.log({req, res})
    try {
      const userDelete = await this.userService.deleteUser(id);
      return res.status(HttpStatus.OK).json({
        ok: true,
        menssage: 'funciona',
        // user,
        userDelete,
      });
    } catch (error) {
      throw new NotFoundException(
        'No se pudo agregar a la base de datos el usuario ingresado',
      );
    }
  }

  @Post('/login') //localhost:3001/user/create
  async logineUser(@Req() req, @Res() res, @Body() user: UserInterface) {
    // console.log({req, res})
    try {
      const userLogin = await this.userService.login(user.email);

      if (comparPass(user.password, userLogin.password)) {
        return res.status(HttpStatus.OK).json({
          ok: true,
          menssage: 'funciona',
          userLogin,
          pass: user.password,
        });
      } else if (user.password == '' || userLogin.password == '') {
        return res.status(400).json({
          ok: false,
          mensaje: 'Campo vacio',
          // errors: {message:'Error no se encuentra email: ' + body.email +  ' asociado'}
          errors: { message: 'El campo no puede estar vacio' },
        });
      } else {
        return res.status(400).json({
          ok: false,
          mensaje: 'Credenciales incorrectas',
          // errors: {message:'Error no se encuentra email: ' + body.email +  ' asociado'}
          errors: { message: 'Error no coincide la clave' },
        });
      }
    } catch (error) {
      console.log('error', error);
      // throw new NotFoundException('No se pudo agregar a la base de datos el usuario ingresado');
      return res.status(400).json({
        ok: false,
        error: {
          status: HttpStatus.BAD_REQUEST,
          menssage: 'El usuario no existe en la base de datos',
        },
      });
    }
  }

  // subir imagen a user
  @Put('/upload/:tipoImagen/:id')
  async uploadoImage( @UploadedFiles() file,@Req() req,@Res() res: Response,@Body() user: any,@Param('id') id: string, @Param('tipoImagen') tipoImagen: string ) {
    try {
      const imagen = tipoImagen;
      const idUser = id;
      const tipoImagenesValidos = ['usuario', 'pc', 'memoria', 'otros'];
      if (tipoImagenesValidos.indexOf(tipoImagen) < 0) {
        return res.status(400).json({
          ok: false,
          mensaje: 'tipo de coleccion no valida',
          errors: {
            message:
              'tipo de coleccion no valida solo son permitidad monitor, memoria, otros',
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
      // var extensionArchivo = nombreArchivoSeparado[ultimapocicion.length - 1]; // obtener la extension del archivo
      const extensionArchivo = nombreArchivoSeparado[nombreArchivoSeparado.length - 1]; // obtener la extension del archivo

      // Extensiones permitidas
      const extensionesValida = ['png', 'jpg', 'gif', 'jpeg'];
      if (extensionesValida.indexOf(extensionArchivo) < 0) {
        // Si manda un -1 o cualquier otro valor menor a cero manda error
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

      // Mover el archivo  del temporal a un path en especifico
      // const pat = Path.dirname(__dirname + `/uploads/${tipoImagen}/${nombreImagenPersonalizado}/usuario` );
      // const path = `/home/muho/Documents/nestJs/invertario/dist/user/uploads/user/${tipoImagen}/${nombreImagenPersonalizado}`;

      // const path = `./uploads/${tipoImagen}/${nombreImagenPersonalizado}`;

      const path = `/home/muho/Documents/nestJs/invertario/dist/user/uploads/${tipoImagen}/${nombreImagenPersonalizado}`;
      console.log({ __dirname, path });

      // const path = `/home/muho/Documents/nestJs/invertario/dist/uploads/${tipoImagen}/${nombreImagenPersonalizado}`;
      // console.log({path})
      // nombreArchivo.mv(path, (err) => {
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

      const userUpdate: any = await this.userService.subirImagenPorTipo( tipoImagen, id, nombreImagenPersonalizado,res);
      // return res.json({
      //   ok: true,
      //   path,
      //   userUpdate
      // })
    } catch (error) {
      console.log({ error });
      throw new NotFoundException('No se pudo agregar a la base de datos el usuario ingresado');
    }
  }
}
