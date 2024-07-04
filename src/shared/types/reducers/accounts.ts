import { AccountNumber, Dict, IdentificationData } from '@shared/types';

export interface Account extends AccountNumber, IdentificationData {}

export type Accounts = Dict<Account>;