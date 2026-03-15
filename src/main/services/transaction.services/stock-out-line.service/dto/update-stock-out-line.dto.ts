import { PartialType } from '@nestjs/swagger'
import { CreateStockOutLineDto } from './create-stock-out-line.dto'

export class UpdateStockOutLineDto extends PartialType(CreateStockOutLineDto) {}
