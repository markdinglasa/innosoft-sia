import { PartialType } from '@nestjs/swagger'
import { CreateDebitCreditMemoLineDto } from './create-debit-credit-memo-line.dto'

export class UpdateDebitCreditMemoLineDto extends PartialType(CreateDebitCreditMemoLineDto) {}
