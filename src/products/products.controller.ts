import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/users.entity';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product', description: 'Creates a new product record (requires authenticated user)' })
  @ApiResponse({ status: 201, description: 'Product was created successfully', type: Product })
  @ApiResponse({ status: 400, description: 'Bad Request (Validation error or duplicate slug/title)' })
  @ApiResponse({ status: 401, description: 'Unauthorized (Token missing or invalid)' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user:User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products', description: 'Retrieves a list of products with optional pagination' })
  @ApiResponse({ status: 200, description: 'List of products retrieved successfully', type: [Product] })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Get product by term', description: 'Search a product by UUID, title, or slug' })
  @ApiParam({ name: 'term', description: 'Product UUID, title, or slug', example: 't_shirt_teslo' })
  @ApiResponse({ status: 200, description: 'Product details retrieved successfully', type: Product })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product by ID', description: 'Updates an existing product by its UUID (requires Admin role)' })
  @ApiParam({ name: 'id', description: 'Product UUID', example: '025e675b-d055-4a6d-b4ca-cc4bb2a02c2d' })
  @ApiResponse({ status: 200, description: 'Product updated successfully', type: Product })
  @ApiResponse({ status: 400, description: 'Bad Request (Invalid data or UUID)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (Requires admin role)' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(
    @Param('id',ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user:User
  )
    {
    return this.productsService.update(id, updateProductDto,user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product by ID', description: 'Removes a product from database by its UUID (requires Admin role)' })
  @ApiParam({ name: 'id', description: 'Product UUID', example: '025e675b-d055-4a6d-b4ca-cc4bb2a02c2d' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request (Invalid UUID format)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (Requires admin role)' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
