import {
  Entity,
  PrimaryColumn,
  Column,
  Generated,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Marca } from './Marca';
import { AnoModelo } from './AnoModelo';
import { RailsModel } from './RailsModel';

@Entity({
  name: 'modelos',
  synchronize: false,
})
export class Modelo extends RailsModel {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ name: 'id_fipe' })
  idFipe: number;

  @ManyToOne(type => Marca, marca => marca.modelos)
  @JoinColumn({ name: 'marca_id' })
  marca: Marca;

  @OneToMany(type => AnoModelo, anoModelo => anoModelo.modelo)
  @JoinColumn({ name: 'modelo_id' })
  anoModelos: AnoModelo[];
}
