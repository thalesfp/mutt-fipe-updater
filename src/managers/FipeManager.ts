import { EntityManager } from "typeorm";

import { adaptCombustivel, adaptReferencia, adaptValor } from "../adapters/adaptFromFipeApi";
import { adaptAnoCombustivel } from "../adapters/adaptToFipeApi";
import { AnoModelo } from "../entity/AnoModelo";
import { Marca } from "../entity/Marca";
import { Modelo } from "../entity/Modelo";
import { Referencia } from "../entity/Referencia";
import { TipoVeiculo } from "../enums/TipoVeiculo";
import { ReferenciasResponseType } from "../interfaces/FipeResponseTypes";
import FipeService from "../services/FipeService";

export class FipeManager {
  public getLastReferenciaFromApi = async (): Promise<Referencia> => {
    try {
      const referencias = await FipeService.referencias();

      const lastReferencia = referencias.data.reduce(
        (prev: ReferenciasResponseType, current: ReferenciasResponseType) =>
          prev.Codigo > current.Codigo ? prev : current,
      );

      return adaptReferencia(lastReferencia);
    } catch (error) {
      throw error;
    }
  }

  public getCurrentReferenciaInDatabase = async (manager: EntityManager): Promise<Referencia> => {
    return await manager.findOne(Referencia, 1);
  }

  public getMarcas = async (tipoVeiculo: TipoVeiculo): Promise<Marca[]> => {
    const marcas: Marca[] = [];

    try {
      const response = await FipeService.marcas(tipoVeiculo);

      for (const marcaResponse of response.data) {
        const marca = new Marca();

        marca.nome = marcaResponse.Label;
        marca.idFipe = Number(marcaResponse.Value);
        marca.tipo = tipoVeiculo;

        marcas.push(marca);
      }
    } catch (error) {
      throw error;
    }

    return marcas;
  }

  public getModelos = async (tipoVeiculo: TipoVeiculo, marca: Marca): Promise<Modelo[]> => {
    const modelos: Modelo[] = [];

    try {
      const response = await FipeService.modelos(tipoVeiculo, marca.idFipe);

      for (const modeloResponse of response.data) {
        const modelo = new Modelo();

        modelo.nome = modeloResponse.Label;
        modelo.idFipe = Number(modeloResponse.Value);
        modelo.marca = marca;

        modelos.push(modelo);
      }
    } catch (error) {
      throw error;
    }

    return modelos;
  }

  public getAnoModelos = async (
    tipoVeiculo: TipoVeiculo,
    marca: Marca,
    modelo: Modelo,
  ): Promise<AnoModelo[]> => {
    const anoModelos: AnoModelo[] = [];

    try {
      const response = await FipeService.anoModelos(tipoVeiculo, marca.idFipe, modelo.idFipe);

      for (const anoModeloResponse of response.data) {
        const anoModelo = new AnoModelo();

        const { ano, combustivel } = adaptAnoCombustivel(anoModeloResponse.Value);

        anoModelo.ano = ano;
        anoModelo.combustivel = combustivel;
        anoModelo.modelo = modelo;

        anoModelos.push(anoModelo);
      }
    } catch (error) {
      throw error;
    }

    return anoModelos;
  }

  public getAnoModelo = async (
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
      throw error;
    }
  }
}
