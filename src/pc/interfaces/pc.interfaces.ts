import { Document } from "mongoose";
import * as mongoose from 'mongoose';


export interface PcInterface extends mongoose.Document {
   nameModel: string;
   img: string;
   type: string;
   created: Date;

}

