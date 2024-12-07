import { Url } from '@/infra/db/entities/url.entity'
import { CreateURL, UrlRepository } from '@/signature/urls-repository'
import { randomUUID } from 'crypto'

export class InMemoryUrlRepository implements UrlRepository {
  public items: Url[] = []

  async create({ urlOriginal, urlShort, userId }: CreateURL): Promise<Url> {
    const url = {
      id: randomUUID().toString(),
      url: urlOriginal,
      urlShort,
      userId: userId || null,
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    } as Url

    this.items.push(url)
    return url
  }

  async findByShortUrlAndUserId(
    urlShort: string,
    userId: string | null,
  ): Promise<Url | null> {
    return (
      this.items.find(
        (item) => item.urlShort === urlShort && item.userId === userId,
      ) || null
    )
  }

  async findByUrlIdAndUserId(
    urlId: string,
    userId: string,
  ): Promise<Url | null> {
    return (
      this.items.find((item) => item.id === urlId && item.userId === userId) ||
      null
    )
  }

  async findOriginalUrl(
    originalUrl: string,
    userId: string | null,
  ): Promise<Url | null> {
    return (
      this.items.find(
        (item) => item.url === originalUrl && item.userId === userId,
      ) || null
    )
  }

  async findUrlsByUserId(userId: string): Promise<Url[]> {
    return this.items.filter((item) => item.userId === userId)
  }

  async softDeleteByUrlId(urlId: string): Promise<void> {
    const url = this.items.find((item) => item.id === urlId)
    if (url) {
      url.deletedAt = new Date()
    }
  }

  async updateUrlByUrlId(urlId: string, newUrl: string): Promise<Url> {
    const url = this.items.find((item) => item.id === urlId)
    if (url) {
      url.url = newUrl
      url.updatedAt = new Date()
    }
    return url!
  }

  async updateUrlClicks(urlId: string, totalClicks: number): Promise<void> {
    const url = this.items.find((item) => item.id === urlId)
    if (url) {
      url.clicks = totalClicks
    }
  }
}
