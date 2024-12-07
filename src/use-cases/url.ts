import { Injectable } from '@nestjs/common'
import { UrlRepository } from '@/signature/urls-repository'
import { generateShortUrl } from '../utils/generate-url'
import { UrlDataError } from '../core/error/use-case/url-error'
import { env } from '@/env'

@Injectable()
export class UrlUseCase {
  constructor(private urlRepository: UrlRepository) {}

  async executeUrlShort(urlOriginal: string, userId: string | null) {
    const existsUrl = await this.urlRepository.findOriginalUrl(
      urlOriginal,
      userId,
    )

    if (existsUrl) {
      return {
        urlShort: `${env.URL_BASE}${existsUrl.urlShort}`,
        urlOriginal: existsUrl.url,
        id: existsUrl.id,
      }
    }

    const urlShort = generateShortUrl()

    const url = await this.urlRepository.create({
      urlOriginal,
      urlShort,
      userId,
    })

    return {
      urlShort: `${env.URL_BASE}${url.urlShort}`,
      urlOriginal: url.url,
      id: url.id,
    }
  }

  async executeUrlRedirect(urlShort: string, userId: string | null) {
    const existsUrl = await this.urlRepository.findByShortUrlAndUserId(
      urlShort,
      userId,
    )

    if (!existsUrl) {
      throw new UrlDataError('urlShort does not exists')
    }

    await this.urlRepository.updateUrlClicks(existsUrl.id, ++existsUrl.clicks)

    return existsUrl.url
  }

  async executeListUrlsByUserId(userId: string) {
    const existsUrl = await this.urlRepository.findUrlsByUserId(userId)

    const listUrlsFormated = existsUrl.map((url) => ({
      urlShort: `${env.URL_BASE}${url.urlShort}`,
      clicks: url.clicks,
    }))

    return listUrlsFormated
  }

  async executeDeleteUrl(urlId: string, userId: string) {
    const existsUrl = await this.urlRepository.findByUrlIdAndUserId(
      urlId,
      userId,
    )

    if (!existsUrl) {
      throw new UrlDataError('id does not exists')
    }

    const urlUpdated = await this.urlRepository.softDeleteByUrlId(urlId)

    return urlUpdated
  }

  async executeUpdateUrl(newUrl: string, urlId: string, userId: string) {
    const existsUrl = await this.urlRepository.findByUrlIdAndUserId(
      urlId,
      userId,
    )

    if (!existsUrl) {
      throw new UrlDataError('id does not exists')
    }

    const urlUpdated = await this.urlRepository.updateUrlByUrlId(urlId, newUrl)

    await this.urlRepository.updateUrlClicks(existsUrl.id, 0)

    return urlUpdated
  }
}
