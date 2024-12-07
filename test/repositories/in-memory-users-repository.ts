import { User } from '@/infra/db/entities/user.entity'
import { UserRepository } from '@/signature/users-repository'
import { generateShortUrl } from '@/utils/generate-url'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(userId: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === userId)

    if (!user) {
      return null
    }

    return user
  }

  async create(user: User): Promise<User> {
    this.items.push({ id: generateShortUrl(), ...user })

    return this.items[0]
  }
}
