export abstract class ValueObject<Props extends Record<string, unknown>> {
  protected constructor(protected readonly props: Props) {
    this.validate(props);
  }

  protected abstract validate(props: Props): boolean;

  public isEqual(other: this): boolean {
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}
