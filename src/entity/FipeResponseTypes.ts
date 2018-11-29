export class ReferenciasResponseType {
  Codigo: number;
  Mes: string;
}

export class MarcasResponseType {
  Label: string;
  Value: number;
}

export class ModelosResponseType {
  Label: string;
  Value: number;
}

export class AnoModelosResponseType {
  Label: string;
  Value: string;
}

export class AnoModeloResponseType {
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
