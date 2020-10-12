import * as jwt from "jsonwebtoken";

export default class Token {
    private static seed: string = "este-es-el-seed";
    private static caducidad: string = "30d";
  
    constructor() {}
  
    static getJwtToken(payload: any): string {
      // jwt.sign({dataa colocar en el token(payload)}, seed/semillas(definir algo de forma unica del token),{fecha de exipracion del token})
      return jwt.sign({ user: payload }, this.seed, {
        expiresIn: this.caducidad,
      });
    }
  
    static comprobarToken(userToken: string) {
      return new Promise((resolve, reject) => {
        // jwt.verify('token que recibe de la peticion', semillas, callback(err,decoded-informacion del usuario q se coloco en el payload ) )
        jwt.verify(userToken, this.seed, (err, decode) => {
          if (err) {
            // no confiar
            reject("token no valido");
          } else {
            // confiar token valido
            resolve(decode);
          }
        });
      });
    }
  }
  