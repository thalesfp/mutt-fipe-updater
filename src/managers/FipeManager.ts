import { adaptCombustivel, adaptValor } from "../adapters/adaptFromFipeApi";
import { adaptAnoCombustivel } from "../adapters/adaptToFipeApi";
import { AnoModelo } from "../entity/AnoModelo";
import { Marca } from "../entity/Marca";
import { Modelo } from "../entity/Modelo";
import { TipoVeiculo } from "../enums/TipoVeiculo";
import FipeService from "../services/FipeService";

export class FipeManager {
  private currentIdFipe: number;

  constructor(currentIdFipe: number) {
    this.currentIdFipe = currentIdFipe;
  }

  public getMarcas = async (tipoVeiculo: TipoVeiculo): Promise<Marca[]> => {
    const marcas: Marca[] = [];

    try {
      const response = await FipeService.marcas(this.currentIdFipe, tipoVeiculo);

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
  };

  public getModelos = async (tipoVeiculo: TipoVeiculo, marca: Marca): Promise<Modelo[]> => {
    const modelos: Modelo[] = [];

    try {
      const response = await FipeService.modelos(this.currentIdFipe, tipoVeiculo, marca.idFipe);

      for (const modeloResponse of response.data.Modelos) {
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
  };

  public getAnoModelos = async (
    tipoVeiculo: TipoVeiculo,
    marca: Marca,
    modelo: Modelo,
  ): Promise<AnoModelo[]> => {
    const anoModelos: AnoModelo[] = [];

    try {
      const response = await FipeService.anoModelos(
        this.currentIdFipe,
        tipoVeiculo,
        marca.idFipe,
        modelo.idFipe,
      );

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
  };

  public getAnoModelo = async (
    tipoVeiculo: TipoVeiculo,
    marca: Marca,
    modelo: Modelo,
    anoModelo: AnoModelo,
  ): Promise<AnoModelo> => {
    try {
      const { data } = await FipeService.anoModelo(
        this.currentIdFipe,
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
  };
}
