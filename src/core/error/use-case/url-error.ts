import { ConflictException } from '@nestjs/common'
import { UseCaseError } from '../use-case-error'

export class UrlDataError extends ConflictException implements UseCaseError {
  constructor(indentifier: string) {
    super(`url error: ${indentifier} `)
  }
}
