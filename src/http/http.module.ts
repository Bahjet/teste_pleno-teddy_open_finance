import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/infra/db/database.module'
import { UserUseCase } from '@/use-cases/user'
import { RegisterController } from './controllers/register.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { UrlController } from './controllers/url.controller'
import { UrlUseCase } from '@/use-cases/url'

@Module({
  imports: [DatabaseModule],
  controllers: [RegisterController, AuthenticateController, UrlController],
  providers: [UserUseCase, UrlUseCase],
})
export class HttpModule {}
