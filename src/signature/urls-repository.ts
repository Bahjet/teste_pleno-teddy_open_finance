import { Url } from '@/infra/db/entities/url.entity'

export interface CreateURL {
  urlOriginal: string
  urlShort: string
  userId?: string
}

export abstract class UrlRepository {
  abstract findByShortUrlAndUserId(
    urlShort: string,
    userId: string | null,
  ): Promise<Url | null>

  abstract findByUrlIdAndUserId(
    urlId: string,
    userId: string,
  ): Promise<Url | null>

  abstract softDeleteByUrlId(urlId: string): Promise<void>

  abstract updateUrlClicks(urlId: string, totalClicks: number): Promise<void>
  abstract updateUrlByUrlId(urlId: string, newUrl: string): Promise<Url>

  abstract create(url: CreateURL): Promise<Url>

  abstract findUrlsByUserId(userId: string): Promise<Url[]>

  abstract findOriginalUrl(
    originalUrl: string,
    userId: string | null,
  ): Promise<Url | null>
}
