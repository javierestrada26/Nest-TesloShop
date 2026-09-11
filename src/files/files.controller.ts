import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  @ApiOperation({ summary: 'Get product image file', description: 'Serves a static product image by filename' })
  @ApiParam({ name: 'imageName', description: 'Filename of the image (e.g. 1733884-00-A_0_2000.jpg)', example: '1733884-00-A_0_2000.jpg' })
  @ApiResponse({ status: 200, description: 'Returns the static image file stream' })
  @ApiResponse({ status: 400, description: 'Bad Request (Image not found)' })
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string){

    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path);
  }

  @Post('product')
  @ApiOperation({ summary: 'Upload product image', description: 'Uploads an image file for products (jpg, jpeg, png, gif)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully, returns secure URL', schema: { type: 'object', properties: { secureUrl: { type: 'string', example: 'http://localhost:3000/api/files/product/abc123-def.jpg' } } } })
  @ApiResponse({ status: 400, description: 'Bad Request (File missing or invalid extension)' })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      //limits:{fileSize: 1000}
      storage:diskStorage({
        destination:'./static/products',
        filename: fileNamer
      })
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    const secureUrl= `${this.configService.get('HOST_API')}/files/product/${file.filename}`

    return {
      secureUrl
    };
  }
}
