import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { TipoVeiculo } from "../enums/TipoVeiculo";
import { Modelo } from "./Modelo";
import { RailsModel } from "./RailsModel";

@Entity("marcas")
export class Marca extends RailsModel {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

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
