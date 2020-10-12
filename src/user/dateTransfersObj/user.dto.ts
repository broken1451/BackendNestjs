// Dto  que es lo q se estara enviando entre la aplicacion cliente y el servidor

export class UserDTO {
  public readonly name: string;
  public readonly description: string;
  public readonly img: string;
  public readonly email: string;
  public readonly password: string;
  public readonly created: Date;
}
