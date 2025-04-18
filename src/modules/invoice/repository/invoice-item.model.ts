import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
  tableName: "invoice_items",
  timestamps: false,
})
export default class InvoiceItemModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false, field: "invoice_id" })
  @ForeignKey(() => InvoiceModel)
  invoiceId: string;

  @Column({ allowNull: false, field: "name" })
  name: string;

  @Column({ allowNull: false, field: "value" })
  price: number;

  @Column({ allowNull: false, field: "created_at" })
  createdAt: Date;

  @Column({ allowNull: false, field: "updated_at" })
  updatedAt: Date;

  @BelongsTo(() => InvoiceModel, "invoice_id")
  invoice: InvoiceModel;
}
