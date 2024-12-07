import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { UserPayload } from './jwt.strategy'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext): UserPayload | undefined => {
    const request: Request = context.switchToHttp().getRequest()

    return request.user as UserPayload | undefined
  },
)
