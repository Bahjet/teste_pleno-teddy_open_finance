import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { env } from '@/env'
import { UserRepository } from '@/signature/users-repository'
import { TypeormUsersRepository } from './typeorm-repository/typeorm-users-repository'
import { User } from './entities/user.entity'
import { Url } from './entities/url.entity'
import { UrlRepository } from '@/signature/urls-repository'
import { TypeormUrlRepository } from './typeorm-repository/typeorm-urls-repository'

// npm run migration:create --name=user-table

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([User, Url]),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: TypeormUsersRepository,
    },
    {
      provide: UrlRepository,
      useClass: TypeormUrlRepository,
    },
  ],
  exports: [UserRepository, UrlRepository],
})
export class DatabaseModule {}
