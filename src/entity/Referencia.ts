import { Column, Entity } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("referencias")
export class Referencia extends BaseEntity {
  @Column({ name: "id_fipe" })
  public idFipe: number;

  @Column()
  public mes: number;

  @Column()
  public ano: number;
}
