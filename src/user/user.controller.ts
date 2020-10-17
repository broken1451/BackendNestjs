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
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { UserDTO } from './dateTransfersObj/user.dto';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserInterface } from './interfaces/user.interfaces';
import Token from 'src/utils/token';
import FileSystem from 'fs';
import * as fileUpload from 'express-fileupload';
import * as express from 'express';
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor, MulterModule } from '@nestjs/platform-express';
import { Response } from 'express';
import * as Path from 'path';
import { Usuario } from './schema/userSchema';
import * as multer from 'multer';



const app = express();
app.use(fileUpload());


@Controller('user')
export class UserController {
  // controlador vamos a manejar las rutas que vienen a nuestro servidor

  constructor(private userService: UserService) {}

  @Get('/')
  async getAllUsers(@Req() req, @Res() res) {
    const users = await this.userService.getAllUser();
    return res.status(HttpStatus.OK).json({
      ok: true,
      menssage: 'funciona',
      users,
    });
  }

  @Post('/create') //localhost:3001/user/create
  async createUser(@Req() req, @Res() res, @Body() user: UserInterface) {
    // console.log({req, res})
    try {
      user.password = bcrypt.hashSync(user.password, 10);
      console.log({ pass: bcrypt.hashSync(user.password, 10) });
      const userCreated: UserInterface = await this.userService.createUser(
        user,
      );
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
  async updateUser( @Req() req, @Res() res, @Body() user: any, @Param('id') id: string ) {
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
        },
      });
    }
  }

  // subir imagen a user

  @Put('/upload/:tipoImagen/:id')
  // @UseInterceptors(FileInterceptor('image', {
  //   dest: './uploads/usuario'
  // }))
  // @UseInterceptors(FileFieldsInterceptor([
  //   { name: 'usuario', maxCount: 1 },
  //   // { name: 'monitor', maxCount: 1 },
  // ]))
  // @UseInterceptors(AnyFilesInterceptor())
  async uploadoImage(@UploadedFiles() file ,@Req() req, @Res() res: Response, @Body() user: any, @Param('id') id: string,  @Param('tipoImagen') tipoImagen: string) {
    // console.log({file});
    try {
      const imagen = tipoImagen;
      const idUser = id;
      // tipoImagen de archivos de coleccion usuario o estudiantes
      const tipoImagenesValidos = ['usuario','monitor', 'memoria', 'otros'];
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
          mensaje: "No selecciono nada",
          errors: { message: "Debe de seleccionar una imagen" },
        });
      }

        // Obtener nombre del archivo
        const nombreArchivo = file.image; //imagen es el nombre que esta en el postman
        const nombreArchivoSeparado = nombreArchivo.name.split('.'); // separar en un arreglo el archivo para tener su extension
        // var extensionArchivo = nombreArchivoSeparado[ultimapocicion.length - 1]; // obtener la extension del archivo
        const extensionArchivo = nombreArchivoSeparado[nombreArchivoSeparado.length - 1]; // obtener la extension del archivo

        // Extensiones permitidas
        const extensionesValida = ['png','jpg','gif','jpeg'];
        if (extensionesValida.indexOf(extensionArchivo) < 0) { // Si manda un -1 o cualquier otro valor menor a cero manda error
          return res.status(400).json({
            ok: false,
            mensaje: "Extension no valida",
            errors: {
              message:
                "La extesion agregada no es permitida solo se admiten estas extensiones: " +  extensionesValida.join(","),
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
        console.log({__dirname, path})

        // const path = `/home/muho/Documents/nestJs/invertario/dist/uploads/${tipoImagen}/${nombreImagenPersonalizado}`;
        // console.log({path})
        // nombreArchivo.mv(path, (err) => {
        nombreArchivo.mv(path, (err) => {
          console.log({nombreArchivo})
          if (err) {
            console.log({err})
            return res.status(500).json({
              ok: false,
              mensaje: "Error al mover archivo",
              errors: err 
            });
          }
        })
      
      //  const userUpdate = await this.userService.updateUser(id,user);
       const userUpdate = await this.userService.subirImagenPorTipo(tipoImagen, id, nombreImagenPersonalizado, res);
      //  await console.log({userUpdate})
      // return res.json({
      //   ok: true,
      //   path,
      //   userUpdate
      // })
    } catch (error) {
      console.log({error})
      throw new NotFoundException(
        'No se pudo agregar a la base de datos el usuario ingresado',
      );
    }
  }
}

export function comparPass(password: string = '', passEcripted: string) {
  // console.log({password, passEcripted})
  if (bcrypt.compareSync(password, passEcripted)) {
    console.log('son iguales');
    return true;
  } else {
    return false;
  }
}

// export function subirImagenPorTipo(tipoImagen, id, nombreImagenPersonalizado, res) {
//   if(tipoImagen == 'usuario'){
//     Usuario.findById(id, (err, usuario) => {
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

