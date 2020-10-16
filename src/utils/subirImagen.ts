import { Response } from 'express';
import FileSystem from 'fs';
import {Usuario} from '../user/schema/userSchema'


export default async function subirImagenPorTipo(tipoImagen: string, id: string, nombreImagenPersonalizado: string, res: Response) {
    if(tipoImagen == 'usuario'){
        Usuario.findById(id,(err,imgUser) => {
        if (err) {
          return  res.status(500).json({
              ok: false,
              mensaje: "Error al subir Imagen",
              errors: err
          });
        }

        if (!imgUser) {
          return  res.status(500).json({
                ok: false,
                mensaje: "Error el usuario con ese id no existe",
                errors: err
            });
        }

        var pathViejo = '/home/muho/Documents/nestJs/invertario/dist/uploads/usuario' + imgUser.img; 
          if (FileSystem.existsSync(pathViejo)) {  // si existe elimina la imagen anterior
            FileSystem.unlink(pathViejo,(err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error en path",
                        errors: err
                    });
                }
            });
        }

        imgUser.img = nombreImagenPersonalizado;
        imgUser.save((err, usuarioActualizado) => {
          if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al subir imagen de usuario",
                errors: err
            });
          }
          usuarioActualizado.password = ':)';
          return res.status(200).json({
            ok: true,
            mensaje: "Imagen de usuario actualizada ",
            usuarioActualizado: usuarioActualizado
          });
        })
      });

    }


}