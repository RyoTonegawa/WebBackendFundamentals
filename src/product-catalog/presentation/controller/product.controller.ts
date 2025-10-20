import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductUseCase } from '../../application/usecase/create-product.usecase';
import { DeleteProductUseCase } from '../../application/usecase/delete-product.usecase';
import { ListProductsUseCase } from '../../application/usecase/list-products.usecase';
import { UpdateProductUseCase } from '../../application/usecase/update-product.usecase';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductResponseDto } from '../dto/product-response.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@ApiTags('商品')
@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: '新しい商品を登録します。' })
  @ApiHeader({
    name: 'x-request-id',
    description: 'クライアント側で生成したUUID v7。未指定の場合はサーバーが採番します。',
    required: false,
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: '商品を作成しました。', type: ProductResponseDto })
  async create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.createProductUseCase.execute(dto);
    return ProductResponseDto.fromDomain(product);
  }

  @Get()
  @ApiOperation({ summary: '登録済みの商品一覧を取得します。' })
  @ApiHeader({
    name: 'x-request-id',
    description: 'クライアント側で生成したUUID v7。未指定の場合はサーバーが採番します。',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: '商品一覧を返却しました。',
    type: ProductResponseDto,
    isArray: true,
  })
  async list(): Promise<ProductResponseDto[]> {
    const products = await this.listProductsUseCase.execute();
    return products.map(ProductResponseDto.fromDomain);
  }

  @Put(':id')
  @ApiOperation({ summary: '既存の商品情報を更新します。' })
  @ApiHeader({
    name: 'x-request-id',
    description: 'クライアント側で生成したUUID v7。未指定の場合はサーバーが採番します。',
    required: false,
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: '商品を更新しました。存在しない場合は404を返却します。',
    type: ProductResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.updateProductUseCase.execute(id, dto);
    return ProductResponseDto.fromDomain(product);
  }

  @Delete(':id')
  @ApiOperation({ summary: '商品を削除します。' })
  @ApiHeader({
    name: 'x-request-id',
    description: 'クライアント側で生成したUUID v7。未指定の場合はサーバーが採番します。',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: '商品を削除しました。存在しない場合は404を返却します。',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteProductUseCase.execute(id);
  }
}
