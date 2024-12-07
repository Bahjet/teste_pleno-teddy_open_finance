import { Injectable } from '@nestjs/common'
import { UserRepository } from '@/signature/users-repository'
import { compare, hash } from 'bcryptjs'
import { UserDataError } from '../core/error/use-case/user-error'
import { JwtService } from '@nestjs/jwt'
import { RegisterUserBodySchema } from '@/schemas/register-zod-schema'

@Injectable()
export class UserUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwt: JwtService,
  ) {}

  async executeRegister({ name, email, password }: RegisterUserBodySchema) {
    const userWithSomeEmail = await this.userRepository.findByEmail(email)

    if (userWithSomeEmail) {
      throw new UserDataError(`${email} already exists`)
    }

    const hashedPassword = await hash(password, 8)

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    return user
  }

  async executeAuthenticate({ email, password }) {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new UserDataError(`credentials does not match`)
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UserDataError(`credentials does not match`)
    }

    const refreshToken = this.jwt.sign({
      id: user.id,
    })

    const { name } = user

    return { name, refreshToken }
  }
}
