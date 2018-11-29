import { TipoVeiculo } from '../enums/TipoVeiculo';

export const adaptTipoVeiculo = (tipoVeiculo: TipoVeiculo): String => {
  switch (tipoVeiculo) {
    case TipoVeiculo.carro:
      return 'carros';
    case TipoVeiculo.moto:
      return 'motos';
    default:
      throw new Error(`Tipo de veículo inválido: ${tipoVeiculo}`);
  }
};

export const adaptAnoCombustivel = (value: String): { ano: number; combustivel: number } => {
  const ano: number = Number(value.split('-')[0]);
  const combustivel: number = Number(value.split('-')[1]);

  return { ano, combustivel };
};
