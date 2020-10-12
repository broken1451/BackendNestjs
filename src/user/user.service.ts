import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { UserInterface } from './interfaces/user.interfaces';
import { UserDTO } from './dateTransfersObj/user.dto';
import { userSchema } from './schema/userSchema';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class UserService {
  constructor(@InjectModel('users') public userModel: mongoose.Model<any>) {} // injectar el modelo en esta clase
  // constructor(@InjectModel('user') public userModel: Model<UserInterface> ) {} // injectar el modelo en esta clase

  async getAllUser(): Promise<any> {
    const users = await this.userModel.find({}).exec();
    return users;
  }

  async createUser(usuario: UserDTO): Promise<any> {
    try {
      //   async createUser(usuario: any):  Promise<any> {
      const user = await this.userModel.create(usuario);
      // const user = new this.userModel(usuario);
      await user.save();
      return user;
    } catch (error) {
       let res: Response;
      console.log({ error });
      return res.status(401).json({
        ok: false,
        error
      });
    }
  }

  async updateUser(id: string, usuario: any): Promise<any> {
    try {
      //   async createUser(usuario: any):  Promise<any> {
      const user = await this.userModel.findByIdAndUpdate(id, usuario, {
        new: true,
      });
      return user;
    } catch (error) {
      console.log({ error });
    }
  }

  async deleteUser(id: string): Promise<any> {
    try {
      //   async createUser(usuario: any):  Promise<any> {
      const user = await this.userModel.findByIdAndRemove(id);
      return user;
    } catch (error) {
      console.log({ error });
    }
  }

  async login(email: string): Promise<any> {
    try {
      //   async createUser(usuario: any):  Promise<any> {
      const userLogin = await this.userModel.findOne({email: email});
      return userLogin;
    } catch (error) {
      console.log({ error });
    }
  }
}
