import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { Modelo } from './Modelo';
import { TipoVeiculo } from '../enums/TipoVeiculo';
import { RailsModel } from './RailsModel';

@Entity({
  name: 'marcas',
  synchronize: false,
})
export class Marca extends RailsModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ name: 'id_fipe' })
  idFipe: number;

  @Column()
  tipo: TipoVeiculo;

  @OneToMany(type => Modelo, modelo => modelo.marca)
  @JoinColumn({ name: 'marca_id' })
  modelos: Modelo[];
}
