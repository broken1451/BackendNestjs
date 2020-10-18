import { Document } from "mongoose";
import * as mongoose from 'mongoose';


export interface PcInterface extends mongoose.Document {
   name: string;
   img: string;
   created: Date;
}
