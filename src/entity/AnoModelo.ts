import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { BaseEntity } from "./BaseEntity";
import { Modelo } from "./Modelo";

@Entity("ano_modelos")
export class AnoModelo extends BaseEntity {
  @PrimaryColumn()
  @Generated("uuid")
  public id: string;

  @Column()
  public ano: number;

  @Column()
  public combustivel: number;

  @Column({ name: "codigo_fipe" })
  public codigoFipe: string;

  @Column({ type: "float" })
  public valor: number;

  @ManyToOne(() => Modelo, (modelo) => modelo.anoModelos)
  @JoinColumn({ name: "modelo_id" })
  public modelo: Modelo;
}
