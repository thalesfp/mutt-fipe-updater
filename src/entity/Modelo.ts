import { Entity, PrimaryColumn, Column, Generated, ManyToOne, JoinColumn } from 'typeorm';

import { Marca } from './Marca';

@Entity({
  name: 'modelos',
  synchronize: false,
})
export class Modelo {
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
}
