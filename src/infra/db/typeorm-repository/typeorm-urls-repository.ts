import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Url } from '../entities/url.entity'
import { CreateURL, UrlRepository } from '@/signature/urls-repository'

@Injectable()
export class TypeormUrlRepository implements UrlRepository {
  constructor(
    @InjectRepository(Url)
    private readonly repository: Repository<Url>,
  ) {}

  async findByShortUrlAndUserId(
    urlShort: string,
    userId: string,
  ): Promise<Url | null> {
    const url = await this.repository.findOne({
      where: {
        userId,
        urlShort,
      },
    })

    return url
  }

  async softDeleteByUrlId(urlId: string): Promise<void> {
    await this.repository.softDelete({ id: urlId })
  }

  async updateUrlByUrlId(urlId: string, newUrl: string): Promise<Url> {
    await this.repository.update({ id: urlId }, { url: newUrl })

    const urlUpdated = await this.repository.findOneBy({ id: urlId })

    return urlUpdated
  }

  async updateUrlClicks(urlId: string, totalClicks: number): Promise<void> {
    await this.repository.update({ id: urlId }, { clicks: totalClicks })
  }

  async findByUrlIdAndUserId(
    urlId: string,
    userId: string,
  ): Promise<Url | null> {
    const url = await this.repository.findOne({
      where: {
        userId,
        id: urlId,
      },
    })

    return url
  }

  async findUrlsByUserId(userId: string): Promise<Url[]> {
    const urls = await this.repository.find({ where: { userId } })

    return urls
  }

  async findOriginalUrl(
    originalUrl: string,
    userId: string | null,
  ): Promise<Url | null> {
    const url = await this.repository.findOne({
      where: {
        userId,
        url: originalUrl,
      },
    })

    return url
  }

  async create({ urlOriginal, urlShort, userId }: CreateURL): Promise<Url> {
    const url = this.repository.create({ url: urlOriginal, urlShort, userId })

    return this.repository.save(url)
  }
}
