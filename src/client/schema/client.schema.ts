import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClientDocument = HydratedDocument<Client>;

@Schema({
  timestamps: true,
})
export class Client {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false })
  phone: string;

  @Prop({ type: Number, required: false, unique: true })
  telegramId: number;
}

export default SchemaFactory.createForClass(Client);
