export class CreateExpenseDto {
  financialAccountId!: string;
  categoryId!: string;
  name!: string;
  amount!: number;
  date!: string;
}
