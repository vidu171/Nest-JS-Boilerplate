import { getMongoConnectionString } from '@utils/platform.util'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import _ from 'lodash'

export const MongooseHandlerModule = MongooseModule.forRootAsync({
  imports: [],
  useFactory: (): MongooseModuleOptions => ({
    uri: getMongoConnectionString(),
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
})