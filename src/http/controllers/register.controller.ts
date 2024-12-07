import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { UserUseCase } from '@/use-cases/user'
import {
  RegisterUserBodySchema,
  registerUserBodySchema,
} from '../../schemas/register-zod-schema'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { registerUserSchemaSwagger } from '@/schemas-documentation/schemas-payloas-controllers'

@ApiTags('users')
@Controller('/users')
export class RegisterController {
  constructor(private userUseCase: UserUseCase) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request data.' })
  @ApiBody({ schema: registerUserSchemaSwagger })
  @UsePipes(new ZodValidationPipe(registerUserBodySchema))
  async handle(@Body() body: RegisterUserBodySchema) {
    const { email } = await this.userUseCase.executeRegister({
      ...body,
    })

    return { email }
  }
}
