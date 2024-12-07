import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  HttpRedirectResponse,
  Redirect,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { UrlUseCase } from '@/use-cases/url'
import { CurrentUser } from '@/auth/current-user-decorator'
import { OptionalAuthGuard } from '@/auth/optional-guards'
import { UserPayload } from '@/auth/jwt.strategy'
import { AuthGuard } from '@nestjs/passport'
import {
  registerUrlBodySchema,
  UrlBodySchema,
  urlIdSchema,
  UrlIdSchema,
} from '../../schemas/url-zod-schema'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { env } from '@/env'
import { registerUrlSchemaSwagger } from '@/schemas-documentation/schemas-payloas-controllers'

@ApiTags('url')
@Controller('/url')
export class UrlController {
  constructor(private urlUseCase: UrlUseCase) {}

  @UseGuards(OptionalAuthGuard)
  @Post('/shorten')
  @ApiOperation({ summary: 'Shorten a URL' })
  @ApiResponse({ status: 201, description: 'URL shortened successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid URL format.' })
  @ApiBody({ schema: registerUrlSchemaSwagger })
  async handleShorten(
    @Body(new ZodValidationPipe(registerUrlBodySchema)) { url }: UrlBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const urlShort = await this.urlUseCase.executeUrlShort(url, user?.id)
    console.log(urlShort.id)
    return urlShort
  }

  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiParam({ name: 'hashId', description: 'The shortened URL hash.' })
  @ApiResponse({ status: 302, description: 'Redirected successfully.' })
  @ApiResponse({ status: 409, description: 'URL not found.' })
  @UseGuards(OptionalAuthGuard)
  @Get('/:hashId')
  @Redirect()
  async handleRedirect(
    @Param('hashId', new ZodValidationPipe(urlIdSchema)) urlShort: UrlIdSchema,
    @CurrentUser() user: UserPayload,
  ): Promise<HttpRedirectResponse> {
    const urlOriginal = await this.urlUseCase.executeUrlRedirect(
      urlShort,
      user?.id,
    )

    return {
      url: urlOriginal,
      statusCode: 302,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'List all URLs for a user' })
  @ApiResponse({ status: 200, description: 'URLs retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async handleGet(@CurrentUser() user: UserPayload) {
    const urls = await this.urlUseCase.executeListUrlsByUserId(user.id)

    return urls
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  @ApiOperation({ summary: 'Update a URL' })
  @ApiParam({ name: 'id', description: 'The ID of the URL to update.' })
  @ApiResponse({ status: 200, description: 'URL updated successfully.' })
  @ApiResponse({ status: 409, description: 'URL not found.' })
  @ApiBody({ schema: registerUrlSchemaSwagger })
  async handlePut(
    @Param('id', new ZodValidationPipe(urlIdSchema)) urlId: UrlIdSchema,
    @Body(new ZodValidationPipe(registerUrlBodySchema)) { url }: UrlBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const urlUpdated = await this.urlUseCase.executeUpdateUrl(
      url,
      urlId,
      user.id,
    )

    return {
      url: urlUpdated.url,
      urlShort: `${env.URL_BASE}${urlUpdated.urlShort}`,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a URL' })
  @ApiParam({ name: 'id', description: 'The ID of the URL to delete.' })
  @ApiResponse({ status: 200, description: 'URL deleted successfully.' })
  @ApiResponse({ status: 409, description: 'URL not found.' })
  async handleDelete(
    @Param('id', new ZodValidationPipe(urlIdSchema)) urlId: UrlIdSchema,
    @CurrentUser() user: UserPayload,
  ) {
    await this.urlUseCase.executeDeleteUrl(urlId, user.id)

    return 'URL deleted successfully.'
  }
}
