export interface IUseCase<Input, Output> {
  execute(input: Input): Promise<Output>;
  rollback?(input?: Input): Promise<void>;
}
