import { User } from '@/infra/db/entities/user.entity'

export abstract class UserRepository {
  abstract create(user: Partial<User>): Promise<User>

  abstract findByEmail(email: string): Promise<User | null>

  abstract findById(userId: string): Promise<User | null>
}
