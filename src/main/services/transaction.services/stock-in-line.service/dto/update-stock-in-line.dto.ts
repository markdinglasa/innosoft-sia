import { PartialType } from '@nestjs/swagger'
import { CreateStockInLineDto } from './create-stock-in-line.dto'

export class UpdateStockInLineDto extends PartialType(CreateStockInLineDto) {}
