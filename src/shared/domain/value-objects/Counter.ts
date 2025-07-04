import { InvalidValueObjectException } from "../errors/InvalidValueObjectException";
import { ValueObject } from "./ValueObject";

type CounterProps = { value: number };

export class Counter extends ValueObject<CounterProps> {
  static create(props: CounterProps) {
    return new Counter(props);
  }

  protected validate(props: CounterProps): boolean {
    if (isNaN(Number(props.value))) {
      throw new InvalidValueObjectException("The Counter needs to be a number");
    }

    if (props.value < 0) {
      throw new InvalidValueObjectException(
        "The Counter cannot be less than zero",
      );
    }

    return true;
  }

  incrementByOne(): Counter {
    return Counter.create({ value: this.value + 1 });
  }

  decrementByOne(): Counter {
    return Counter.create({ value: Math.max(0, this.value - 1) });
  }

  incrementBy(amount: number): Counter {
    return Counter.create({ value: this.value + amount });
  }

  decrementBy(amount: number): Counter {
    if (amount > this.value) {
      throw new InvalidValueObjectException(
        "It is not possible to decrement if the value to be subtracted is greater than the current value of the counter",
      );
    }

    return Counter.create({ value: this.value - amount });
  }

  get value(): number {
    return this.props.value;
  }
}
