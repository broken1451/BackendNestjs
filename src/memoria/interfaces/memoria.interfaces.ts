import { Document } from "mongoose";
import * as mongoose from 'mongoose';


export interface MemoriaInterface extends mongoose.Document {
   name: string;
   img: string;
   type: string;
   created: Date;
}

