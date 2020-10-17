import * as bcrypt from 'bcrypt';

export function comparPass(password: string = '', passEcripted: string) {
    // console.log({password, passEcripted})
    if (bcrypt.compareSync(password, passEcripted)) {
      console.log('son iguales');
      return true;
    } else {
      return false;
    }
  }
  
  