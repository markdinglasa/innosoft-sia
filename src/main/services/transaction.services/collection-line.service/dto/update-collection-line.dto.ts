import { PartialType } from '@nestjs/swagger'
import { CreateCollectionLineDto } from './create-collection-line.dto'

export class UpdateCollectionLineDto extends PartialType(CreateCollectionLineDto) {}
