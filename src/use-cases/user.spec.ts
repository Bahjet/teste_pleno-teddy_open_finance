import { test, describe, beforeEach, vi, expect } from 'vitest'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { UserUseCase } from './user'
import { JwtService } from '@nestjs/jwt'
import { UserDataError } from '../core/error/use-case/user-error'

let inMemoryUserRepository: InMemoryUserRepository
let jwtServiceMock: JwtService
let sut: UserUseCase

describe('User UseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()

    jwtServiceMock = {
      sign: vi.fn().mockReturnValue('mocked_refresh_token'),
    } as unknown as JwtService

    sut = new UserUseCase(inMemoryUserRepository, jwtServiceMock)
  })

  test('should register a new user', async () => {
    await sut.executeRegister({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(inMemoryUserRepository.items).toHaveLength(1)
    expect(inMemoryUserRepository.items[0].email).toBe('johndoe@example.com')
  })

  test('should not register user with duplicate email', async () => {
    await sut.executeRegister({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await expect(
      sut.executeRegister({
        name: 'Jane Doe',
        email: 'johndoe@example.com',
        password: '654321',
      }),
    ).rejects.toThrow(UserDataError)

    expect(inMemoryUserRepository.items).toHaveLength(1)
  })

  test('should authenticate a user', async () => {
    await sut.executeRegister({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const result = await sut.executeAuthenticate({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result).toHaveProperty('name', 'John Doe')
    expect(result).toHaveProperty('refreshToken', 'mocked_refresh_token')
  })

  test('should not authenticate with invalid email', async () => {
    await sut.executeRegister({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await expect(
      sut.executeAuthenticate({
        email: 'invalid@example.com',
        password: '123456',
      }),
    ).rejects.toThrow(UserDataError)
  })

  test('should not authenticate with invalid password', async () => {
    await sut.executeRegister({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await expect(
      sut.executeAuthenticate({
        email: 'johndoe@example.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow(UserDataError)
  })
})
