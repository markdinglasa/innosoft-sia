import { PartialType } from '@nestjs/swagger'
import { CreateItemPackageDto } from './create-item-package.dto'

export class UpdateItemPackageDto extends PartialType(CreateItemPackageDto) {}
