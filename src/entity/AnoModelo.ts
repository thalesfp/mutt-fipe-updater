import { Entity, PrimaryColumn, Column, Generated, ManyToOne, JoinColumn } from 'typeorm';

import { Modelo } from './Modelo';
import { RailsModel } from './RailsModel';

@Entity({
  name: 'ano_modelos',
  synchronize: false,
})
export class AnoModelo extends RailsModel {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column()
  ano: number;

  @Column()
  combustivel: number;

  @Column({ name: 'codigo_fipe' })
  codigoFipe: string;

  @Column({ type: 'float' })
  valor: number;

  @ManyToOne(type => Modelo, modelo => modelo.anoModelos)
  @JoinColumn({ name: 'modelo_id' })
  modelo: Modelo;
}
