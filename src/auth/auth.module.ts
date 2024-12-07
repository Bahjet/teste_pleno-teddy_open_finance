import { Module } from '@nestjs/common'

import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { env } from '@/env'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      useFactory() {
        const privateKey = env.JWT_PRIVATE_KEY
        const publicKey = env.JWT_PUBLIC_KEY

        return {
          signOptions: { algorithm: 'RS256', expiresIn: env.JWT_EXPIRES_IN },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
