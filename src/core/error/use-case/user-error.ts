import { ConflictException } from '@nestjs/common'
import { UseCaseError } from '../use-case-error'

export class UserDataError extends ConflictException implements UseCaseError {
  constructor(indentifier: string) {
    super(`user error: ${indentifier} `)
  }
}
