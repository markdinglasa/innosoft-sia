import { PartialType } from '@nestjs/swagger'
import { CreateDebitCreditMemoDto } from './create-debit-credit-memo.dto'

export class UpdateDebitCreditMemoDto extends PartialType(CreateDebitCreditMemoDto) {}
