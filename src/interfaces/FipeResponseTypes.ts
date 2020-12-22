export interface ReferenciasResponseType {
  Codigo: number;
  Mes: string;
}

export interface MarcasResponseType {
  Label: string;
  Value: number;
}

export interface ModelosResponseType {
  Modelos: MarcasResponseType[],
  Anos: AnoModeloResponseType[]
}

export interface AnoModelosResponseType {
  Label: string;
  Value: string;
}

export interface AnoModeloResponseType {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  Autenticacao: string;
  TipoVeiculo: number;
  SigaCombustivel: string;
  DataConsulta: string;
}
