import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { constants, tables } from '@config'
import { getObjectID } from '@utils/platform.util'

@Schema({ collection: tables.USER.collection, autoCreate: true })
export class User extends Document {
  @Prop({ type: String, index: true, required: true })
  firstName: string

  @Prop({ type: String, default: null })
  middleName: string

  @Prop({ type: String, required: true })
  lastName: string

  @Prop({ type: String, index: true, required: true })
  email: string

  
  @Prop({ type: String, index: true, required: true })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)