import { getRepository } from 'typeorm';
import * as async from 'async';

import { FipeManager } from './FipeManager';
import { Referencia } from '../entity/Referencia';
import { TipoVeiculo } from '../enums/TipoVeiculo';
import { Marca } from '../entity/Marca';
import { Modelo } from '../entity/Modelo';
import { AnoModelo } from '../entity/AnoModelo';

const ASYNC_MAP_LIMIT = 3;

export const UpdateManager = {
  init: async () => {
    const currentReferenciaInDatabase = await FipeManager.getCurrentReferenciaInDatabase();
    const lastReferenciaFromApi = await FipeManager.getLastReferenciaFromApi();

    if (UpdateManager.shouldUpdate(currentReferenciaInDatabase, lastReferenciaFromApi)) {
      console.log('Iniciando atualização...');
      await UpdateManager.updateCarros();
    } else {
      console.log('Não precisa atualizar');
    }
  },

  shouldUpdate: (currentReferenciaInDatabase: Referencia, lastReferenciaFromApi: Referencia): Boolean => {
    if (lastReferenciaFromApi.ano > currentReferenciaInDatabase.ano) {
      return true;
    }

    if (lastReferenciaFromApi.mes > currentReferenciaInDatabase.mes) {
      return true;
    }

    return false;
  },

  updateCarros: async (): Promise<Boolean> => {
    const marcas = await UpdateManager.updateMarcas(TipoVeiculo.carro);

    async.mapLimit(marcas, ASYNC_MAP_LIMIT, async (marca, callback) => {
      const modelos = await UpdateManager.updateModelos(TipoVeiculo.carro, marca);

      async.mapLimit(modelos, ASYNC_MAP_LIMIT, async (modelo, callback) => {
        const anoModelos = await UpdateManager.updateAnoModelo(TipoVeiculo.carro, marca, modelo);

        console.log(`${marca.nome} ${modelo.nome} ${anoModelos.length}`);

        callback();
      });

      callback();
    });

    return true;
  },

  updateMotos: (): Boolean => {
    return true;
  },

  updateMarcas: async (tipoVeiculo: TipoVeiculo): Promise<Marca[]> => {
    const marcaRepository = await getRepository(Marca);
    const marcas = await FipeManager.getMarcas(tipoVeiculo);

    marcas.forEach(async marca => {
      if ((await marcaRepository.count({ idFipe: marca.idFipe })) === 0) {
        await marcaRepository.save(marca);
      }
    });

    return marcas;
  },

  updateModelos: async (tipoVeiculo: TipoVeiculo, marca: Marca): Promise<Modelo[]> => {
    const modeloRepository = await getRepository(Modelo);
    const modelos = await FipeManager.getModelos(tipoVeiculo, marca);

    modelos.forEach(async modelo => {
      if ((await modeloRepository.count({ idFipe: modelo.idFipe })) === 0) {
        await modeloRepository.save(modelo);
      }
    });

    return modelos;
  },

  updateAnoModelo: async (tipoVeiculo: TipoVeiculo, marca: Marca, modelo: Modelo): Promise<AnoModelo[]> => {
    const anoModeloRepository = await getRepository(AnoModelo);
    const anoModelos = await FipeManager.getAnoModelos(tipoVeiculo, marca, modelo);

    return anoModelos;
  },
};
