import { getRepository } from "typeorm";

import { adaptCombustivel, adaptReferencia, adaptValor } from "../adapters/adaptFromFipeApi";
import { adaptAnoCombustivel } from "../adapters/adaptToFipeApi";
import { AnoModelo } from "../entity/AnoModelo";
import { Marca } from "../entity/Marca";
import { Modelo } from "../entity/Modelo";
import { Referencia } from "../entity/Referencia";
import { TipoVeiculo } from "../enums/TipoVeiculo";
import { ReferenciasResponseType } from "../interfaces/FipeResponseTypes";
import FipeService from "../services/FipeService";

export const FipeManager = {
  getLastReferenciaFromApi: async (): Promise<Referencia> => {
    const referencias = await FipeService.referencias();

    const lastReferencia = referencias.data.reduce(
      (prev: ReferenciasResponseType, current: ReferenciasResponseType) =>
        prev.Codigo > current.Codigo ? prev : current,
    );

    return adaptReferencia(lastReferencia);
  },

  getCurrentReferenciaInDatabase: async (): Promise<Referencia> => {
    const referenciaRepository = getRepository(Referencia);

    return referenciaRepository.findOne(1);
  },

  getMarcas: async (tipoVeiculo: TipoVeiculo): Promise<Marca[]> => {
    const marcas: Marca[] = [];

    try {
      const response = await FipeService.marcas(tipoVeiculo);

      response.data.forEach((m) => {
        const marca = new Marca();

        marca.nome = m.Label;
        marca.idFipe = Number(m.Value);
        marca.tipo = tipoVeiculo;

        marcas.push(marca);
      });
    } catch (error) {
      console.log(error);
    }

    return marcas;
  },

  getModelos: async (tipoVeiculo: TipoVeiculo, marca: Marca): Promise<Modelo[]> => {
    const modelos: Modelo[] = [];

    try {
      const response = await FipeService.modelos(tipoVeiculo, marca.idFipe);

      response.data.forEach((m) => {
        const modelo = new Modelo();

        modelo.nome = m.Label;
        modelo.idFipe = Number(m.Value);
        modelo.marca = marca;

        modelos.push(modelo);
      });
    } catch (error) {
      console.log(error);
    }

    return modelos;
  },

  getAnoModelos: async (
    tipoVeiculo: TipoVeiculo,
    marca: Marca,
    modelo: Modelo,
  ): Promise<AnoModelo[]> => {
    const anoModelos: AnoModelo[] = [];

    try {
      const response = await FipeService.anoModelos(tipoVeiculo, marca.idFipe, modelo.idFipe);

      response.data.forEach((m) => {
        const anoModelo = new AnoModelo();

        const { ano, combustivel } = adaptAnoCombustivel(m.Value);

        anoModelo.ano = ano;
        anoModelo.combustivel = combustivel;
        anoModelo.modelo = modelo;

        anoModelos.push(anoModelo);
      });
    } catch (error) {
      console.log(error);
    }

    return anoModelos;
  },

  getAnoModelo: async (
    tipoVeiculo: TipoVeiculo,
    marca: Marca,
    modelo: Modelo,
    anoModelo: AnoModelo,
  ): Promise<AnoModelo> => {
    try {
      const { data } = await FipeService.anoModelo(
        tipoVeiculo,
        marca.idFipe,
        modelo.idFipe,
        `${anoModelo.ano}-${anoModelo.combustivel}`,
      );

      const anoModeloModel = new AnoModelo();

      anoModeloModel.codigoFipe = data.CodigoFipe;
      anoModeloModel.valor = adaptValor(data.Valor);
      anoModeloModel.ano = data.AnoModelo;
      anoModeloModel.combustivel = adaptCombustivel(data.Combustivel);
      anoModeloModel.modelo = modelo;

      return anoModeloModel;
    } catch (error) {
      throw new Error(`Ano Modelo Inválido: ${JSON.stringify(error)}`);
    }
  },
};
