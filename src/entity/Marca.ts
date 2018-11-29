import { Entity, PrimaryColumn, Column, Generated, OneToMany, JoinColumn } from 'typeorm';

import { Modelo } from './Modelo';
import { TipoVeiculo } from '../enums/TipoVeiculo';

@Entity({
  name: 'marcas',
  synchronize: false,
})
export class Marca {
  @PrimaryColumn()
  @Generated('uuid')
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
