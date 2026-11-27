export class CreateTransferDto {
  sourceFinancialAccountId!: string;
  destinationFinancialAccountId!: string;
  amount!: number;
  date!: string;
}
