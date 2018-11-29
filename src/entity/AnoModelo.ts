import { Entity, PrimaryColumn, Column, Generated } from 'typeorm';

@Entity({
  name: 'ano_modelos',
  synchronize: false,
})
export class AnoModelo {
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
}
