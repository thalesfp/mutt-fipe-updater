import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";

import { AnoModelo } from "./AnoModelo";
import { BaseEntity } from "./BaseEntity";
import { Marca } from "./Marca";

@Entity("modelos")
export class Modelo extends BaseEntity {
  @PrimaryColumn()
  @Generated("uuid")
  public id: string;

  @Column()
  public nome: string;

  @Column({ name: "id_fipe" })
  public idFipe: number;

  @ManyToOne(() => Marca, (marca) => marca.modelos)
  @JoinColumn({ name: "marca_id" })
  public marca: Marca;

  @OneToMany(() => AnoModelo, (anoModelo) => anoModelo.modelo)
  @JoinColumn({ name: "modelo_id" })
  public anoModelos: AnoModelo[];
}
