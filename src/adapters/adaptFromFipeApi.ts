import { Referencia } from '../entity/Referencia';
import { ReferenciasResponseType } from '../entity/FipeResponseTypes';

const months: { [key: string]: number } = {
  janeiro: 1,
  fevereiro: 2,
  março: 3,
  abril: 4,
  maio: 5,
  junho: 6,
  julho: 7,
  agosto: 8,
  setembro: 9,
  outubro: 10,
  novembro: 11,
  dezembro: 12,
};

export const adaptReferencia = (referenciaFipe: ReferenciasResponseType): Referencia => {
  const referencia = new Referencia();

  const mes = referenciaFipe.Mes.split('/')[0];
  const ano = referenciaFipe.Mes.split('/')[1];

  referencia.mes = months[mes];
  referencia.ano = Number(ano);

  return referencia;
};
