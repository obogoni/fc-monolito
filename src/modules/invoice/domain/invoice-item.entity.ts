import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

export default class InvoiceItem extends BaseEntity {

  private _price: number;
  private _name: string;

  constructor(
    price: number,
    name: string,
    id?: Id
  ) {
    super(id);

    this._price = price;
    this._name = name;
  }

  get price(): number {
    return this._price;
  }

  get name(): string {
    return this._name;
  }
}
