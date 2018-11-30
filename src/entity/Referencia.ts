import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';

@Entity('referencias')
export class Referencia {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'id_fipe' })
  idFipe: number;

  @Column()
  mes: number;

  @Column()
  ano: number;

  @Column({ name: 'last_check' })
  lastCheck: Date;

  @Column({ name: 'last_update' })
  lastUpdate: Date;

  @BeforeInsert()
  setId() {
    this.id = 1;
  }
}
