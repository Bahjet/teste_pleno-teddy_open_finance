import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { env } from './env'
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())

  const config = new DocumentBuilder()
    .setTitle('URL Shortener API - Teddy Open Finance')
    .setDescription('API para gerar, gerenciar e redirecionar URLs encurtadas.')
    .setVersion('1.0')
    .addCookieAuth(env.COOKIE, {
      type: 'apiKey',
      in: 'cookie',
      name: env.COOKIE,
      description: 'JWT usado para autenticação, armazenado em cookies HTTP',
    })
    .addTag('Teddy Open Finance')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api/docs', app, documentFactory)

  await app.listen(env.PORT)
}

bootstrap()
