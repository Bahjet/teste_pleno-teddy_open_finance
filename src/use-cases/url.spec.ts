import { describe, beforeEach, test, expect } from 'vitest'
import { UrlUseCase } from '@/use-cases/url'
import { InMemoryUrlRepository } from 'test/repositories/in-memory-urls-repository'
import { UrlDataError } from '@/core/error/use-case/url-error'
import { env } from '@/env'

let inMemoryUrlRepository: InMemoryUrlRepository
let sut: UrlUseCase

describe('Url Use Case', () => {
  beforeEach(() => {
    inMemoryUrlRepository = new InMemoryUrlRepository()
    sut = new UrlUseCase(inMemoryUrlRepository)
  })

  test('should generate a new short URL', async () => {
    const result = await sut.executeUrlShort('https://extra.com', 'user123')

    expect(result.urlShort).toContain(env.URL_BASE)
    expect(result.urlOriginal).toBe('https://extra.com')
    expect(inMemoryUrlRepository.items).toHaveLength(1)
  })

  test('should return a url existing if it already exists', async () => {
    await sut.executeUrlShort('https://extra.com', 'user123')

    const result = await sut.executeUrlShort('https://extra.com', 'user123')

    expect(result.urlShort).toContain(env.URL_BASE)
    expect(inMemoryUrlRepository.items).toHaveLength(1)
  })

  test('should redirect to the original URL and increment clicks', async () => {
    const { urlShort } = await sut.executeUrlShort(
      'https://extra.com',
      'user123',
    )
    const originalUrl = await sut.executeUrlRedirect(
      urlShort.replace(env.URL_BASE, ''),
      'user123',
    )

    expect(originalUrl).toBe('https://extra.com')
    expect(inMemoryUrlRepository.items[0].clicks).toBe(1)
  })

  test('should trigger an error if the short URL does not exist during redirect', async () => {
    await expect(() =>
      sut.executeUrlRedirect('nonexistent', 'user123'),
    ).rejects.toThrow(UrlDataError)
  })

  test('should list all URLs by user ID', async () => {
    await sut.executeUrlShort('https://example1.com', 'user123')
    await sut.executeUrlShort('https://example2.com', 'user123')

    const urls = await sut.executeListUrlsByUserId('user123')

    expect(urls).toHaveLength(2)
    expect(urls[0].urlShort).toContain(env.URL_BASE)
    expect(urls[1].urlShort).toContain(env.URL_BASE)
  })

  test('should delete a URL by ID', async () => {
    await sut.executeUrlShort('https://extra.com', 'user123')
    const urlId = inMemoryUrlRepository.items[0].id

    await sut.executeDeleteUrl(urlId, 'user123')
    expect(inMemoryUrlRepository.items[0].deletedAt).not.toBeNull()
  })

  test('should trigger an error if deleting a non-existent URL ID', async () => {
    await expect(() =>
      sut.executeDeleteUrl('invalid-id', 'user123'),
    ).rejects.toThrow(UrlDataError)
  })

  test('should update the original URL of a short URL', async () => {
    await sut.executeUrlShort('https://extra.com', 'user123')

    const urlId = inMemoryUrlRepository.items[0].id

    const updatedUrl = await sut.executeUpdateUrl(
      'https://novoextra.com',
      urlId,
      'user123',
    )

    expect(updatedUrl.url).toBe('https://novoextra.com')
    expect(inMemoryUrlRepository.items[0].url).toBe('https://novoextra.com')
  })

  test('should trigger an error if updating a non-existent URL ID', async () => {
    await expect(() =>
      sut.executeUpdateUrl('https://novoextra.com', 'invalid-id', 'user123'),
    ).rejects.toThrow(UrlDataError)
  })
})
