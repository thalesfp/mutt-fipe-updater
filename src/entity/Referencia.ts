import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("referencias")
export class Referencia {
  @PrimaryColumn()
  public id: number;

  @Column({ name: "id_fipe" })
  public idFipe: number;

  @Column()
  public mes: number;

  @Column()
  public ano: number;

  @Column({ name: "last_check" })
  public lastCheck: Date;

  @Column({ name: "last_update" })
  public lastUpdate: Date;

  @BeforeInsert()
  public setId() {
    this.id = 1;
  }
}
