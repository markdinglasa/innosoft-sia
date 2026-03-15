import { PartialType } from '@nestjs/swagger'
import { CreateBranchAccessDto } from './create-branch-access.dto'

export class UpdateBranchAccessDto extends PartialType(CreateBranchAccessDto) {}
