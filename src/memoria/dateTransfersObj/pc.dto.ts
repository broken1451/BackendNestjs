// Dto  que es lo q se estara enviando entre la aplicacion cliente y el servidor

export class PcDTO {
  public readonly nameModel: string;
  public readonly img: string;
  public readonly type: string;
  public readonly created: Date;
}
