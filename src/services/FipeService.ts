import * as axios from 'axios';
import * as retryAxios from 'retry-axios';

import { TipoVeiculo } from '../enums/TipoVeiculo';
import {
  ReferenciasResponseType,
  MarcasResponseType,
  ModelosResponseType,
  AnoModelosResponseType,
  AnoModeloResponseType,
} from '../interfaces/FipeResponseTypes';
import { adaptTipoVeiculo } from '../adapters/adaptToFipeApi';

const baseURL = 'https://tabela-fipe-api-node.herokuapp.com/';

const instance = axios.default.create({
  baseURL,
  timeout: 10000,
});

retryAxios.attach(instance);

export default {
  referencias: async () => instance.get<ReferenciasResponseType[]>('/referencias'),
  marcas: async (tipoVeiculo: TipoVeiculo) =>
    instance.get<MarcasResponseType[]>(`${adaptTipoVeiculo(tipoVeiculo)}/marcas`),
  modelos: async (tipoVeiculo: TipoVeiculo, marca: number) =>
    instance.get<ModelosResponseType[]>(
      `/${adaptTipoVeiculo(tipoVeiculo)}/marcas/${marca}/modelos`
    ),
  anoModelos: async (tipoVeiculo: TipoVeiculo, marca: number, modelo: number) =>
    instance.get<AnoModelosResponseType[]>(
      `/${adaptTipoVeiculo(tipoVeiculo)}/marcas/${marca}/modelos/${modelo}/ano_modelos`
    ),
  anoModelo: async (tipoVeiculo: TipoVeiculo, marca: number, modelo: number, anoModelo: string) =>
    instance.get<AnoModeloResponseType>(
      `/${adaptTipoVeiculo(tipoVeiculo)}/marcas/${marca}/modelos/${modelo}/ano_modelos/${anoModelo}`
    ),
};
