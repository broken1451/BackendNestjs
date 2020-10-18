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
import { PcDTO } from './dateTransfersObj/pc.dto';
import { PcInterface } from './interfaces/pc.interfaces';
import { VerifyTokenMiddleware } from 'src/verify-token.middleware';
import { NotFoundException } from '@nestjs/common';

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


  

}
