import { Column, Entity, JoinColumn, OneToMany } from "typeorm";

import { TipoVeiculo } from "../enums/TipoVeiculo";
import { BaseEntity } from "./BaseEntity";
import { Modelo } from "./Modelo";

@Entity("marcas")
export class Marca extends BaseEntity {
  @Column()
  public nome: string;

  @Column({ name: "id_fipe" })
  public idFipe: number;

  @Column()
  public tipo: TipoVeiculo;

  @OneToMany(() => Modelo, (modelo) => modelo.marca)
  @JoinColumn({ name: "marca_id" })
  public modelos: Modelo[];
}
