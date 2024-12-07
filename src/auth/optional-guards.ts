import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  /* eslint-disable-next-line */
  handleRequest(err: any, user: any) {
    if (err || !user) {
      return null
    }
    return user
  }
}
