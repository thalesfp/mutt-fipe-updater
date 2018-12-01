import { Referencia } from "../entity/Referencia";
import { TipoCombustivel } from "../enums/TipoCombustivel";
import { ReferenciasResponseType } from "../interfaces/FipeResponseTypes";

/* tslint:disable:object-literal-sort-keys */
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

  const mes = referenciaFipe.Mes.split("/")[0];
  const ano = referenciaFipe.Mes.split("/")[1];

  referencia.mes = months[mes];
  referencia.ano = Number(ano);
  referencia.idFipe = referenciaFipe.Codigo;

  return referencia;
};

export const adaptValor = (valor: string): number => {
  const convertedValor = valor.replace(/[^0-9,]/g, "").replace(/,/, ".");

  return parseFloat(convertedValor);
};

export const adaptCombustivel = (combustivel: string): number => {
  switch (combustivel) {
    case "Gasolina":
      return TipoCombustivel.gasolina;
    case "Álcool":
      return TipoCombustivel.alcool;
    case "Diesel":
      return TipoCombustivel.diesel;
    default:
      throw new Error(`Combustível inválido: ${combustivel}`);
  }
};
