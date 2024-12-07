import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from '@/signature/users-repository'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'

@Injectable()
export class TypeormUsersRepository implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data)

    const userCreated = await this.userRepository.save(user)

    return userCreated
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email })

    return user ?? null
  }

  async findById(userId: string | null): Promise<User | null> {
    if (!userId) {
      return null
    }

    const user = await this.userRepository.findOneBy({ id: userId })

    return user ?? null
  }
}
