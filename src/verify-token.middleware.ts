import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import Token from './utils/token';

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    // token enviado por los headers
    const userToken = req.get('x-token') || '';

    Token.comprobarToken(userToken)
      .then(decoded => {
        console.log({ decoded });
        next();
      })
      .catch(err => {
        return res.status(400).json({
          ok: false,
          mensaje: 'token no valido',
        });
      });
    console.log('middleware');
  }
}
