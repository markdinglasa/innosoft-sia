import { PartialType } from '@nestjs/swagger'
import { CreateStockCountLineDto } from './create-stock-count-line.dto'

export class UpdateStockCountLineDto extends PartialType(CreateStockCountLineDto) {}
