import { Document } from "mongoose";
import * as mongoose from 'mongoose';


export interface UserInterface extends mongoose.Document {
   name: string;
   description: string;
   img: string;
   email: string;
   password: string;
   created: Date;
}


