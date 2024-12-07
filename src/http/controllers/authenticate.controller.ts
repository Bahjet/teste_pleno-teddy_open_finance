import { Body, Controller, HttpCode, Post, Res, UsePipes } from '@nestjs/common'
import { Response } from 'express'
import { ZodValidationPipe } from '@/http/pipes/zod-validation-pipe'
import { UserUseCase } from '@/use-cases/user'
import { env } from '@/env'
import {
  AuthenticateBodySchema,
  authenticateBodySchema,
} from '../../schemas/authenticate-zod-schema'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { authenticateSchemaSwagger } from '@/schemas-documentation/schemas-payloas-controllers'

@ApiTags('sessions')
@Controller('/sessions')
export class AuthenticateController {
  constructor(private userUseCase: UserUseCase) {}

  @Post('/user')
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully.' })
  @ApiResponse({ status: 409, description: 'Invalid credentials.' })
  @ApiBody({ schema: authenticateSchemaSwagger })
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  @HttpCode(200)
  async handleUser(
    @Body() body: AuthenticateBodySchema,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = body
    const { refreshToken, name } = await this.userUseCase.executeAuthenticate({
      email,
      password,
    })

    response.cookie(env.COOKIE, refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })

    return { email, name }
  }
}
