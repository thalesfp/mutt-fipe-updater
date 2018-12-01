import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Modelo } from "./Modelo";
import { RailsModel } from "./RailsModel";

@Entity("ano_modelos")
export class AnoModelo extends RailsModel {
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

  @ManyToOne((type) => Modelo, (modelo) => modelo.anoModelos)
  @JoinColumn({ name: "modelo_id" })
  public modelo: Modelo;
}
