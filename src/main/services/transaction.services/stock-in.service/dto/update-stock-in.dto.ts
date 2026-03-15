import { PartialType } from '@nestjs/swagger'
import { CreateStockInDto } from './create-stock-in.dto'

export class UpdateStockInDto extends PartialType(CreateStockInDto) {}
