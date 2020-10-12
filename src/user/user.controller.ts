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
  Query
} from '@nestjs/common';
import { UserDTO } from './dateTransfersObj/user.dto';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserInterface } from './interfaces/user.interfaces';
import Token from 'src/utils/token';



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
        user.password =  bcrypt.hashSync(user.password, 10);
        console.log({pass: bcrypt.hashSync(user.password, 10)});
        const userCreated: UserInterface = await this.userService.createUser(user);
        const token = Token.getJwtToken(userCreated)
        return res.status(HttpStatus.OK).json({
          ok: true,
          menssage: 'funciona',
          // user,
          userCreated,
          token
        });
      } catch (error) {
        console.log('error', error)
        // throw new NotFoundException('No se pudo agregar a la base de datos el usuario ingresado');
        return res.status(400).json({
          ok: false,
          error: {
            message: 'No se pudo agregar a la base de datos el usuario ingresado',
            error: 'El email debe ser unico',
            status: HttpStatus.BAD_REQUEST
          }
        })
      }
    }

  
    @Put('/update/:id') //localhost:3001/user/create
    async updateUser(@Req() req, @Res() res, @Body() user: any, @Param('id') id:string) {
      // console.log({req, res})
      try {
        const userUpdate = await this.userService.updateUser(id,user);
        
        return res.status(HttpStatus.OK).json({
          ok: true,
          menssage: 'funciona',
          // user,
          userUpdate,
        });
      } catch (error) {
        throw new NotFoundException('No se pudo agregar a la base de datos el usuario ingresado');
      }
    }

    @Delete('/delete/:id') //localhost:3001/user/create
    async deleteUser(@Req() req, @Res() res, @Param('id') id:string) {
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
        throw new NotFoundException('No se pudo agregar a la base de datos el usuario ingresado');
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
            pass: user.password
          });
        } else if(user.password == '' || userLogin.password == '') {
          return res.status(400).json({
            ok: false,
            mensaje: "Campo vacio",
            // errors: {message:'Error no se encuentra email: ' + body.email +  ' asociado'}
            errors: { message: "El campo no puede estar vacio" },
          });
        } else {
          return res.status(400).json({
            ok: false,
            mensaje: "Credenciales incorrectas",
            // errors: {message:'Error no se encuentra email: ' + body.email +  ' asociado'}
            errors: { message: "Error no coincide la clave" },
          });
        }
      } catch (error) {
        console.log('error', error)
        // throw new NotFoundException('No se pudo agregar a la base de datos el usuario ingresado');
        return res.status(400).json({
          ok: false,
          error: {
            status: HttpStatus.BAD_REQUEST
          }
        })
      }
    }
}


export function comparPass(password: string = "", passEcripted: string) {
  // console.log({password, passEcripted})
  if (bcrypt.compareSync(password, passEcripted)) {
    console.log('son iguales');
    return true;
  } else {
    return false;
  }
}
