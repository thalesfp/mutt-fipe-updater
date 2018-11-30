import { getRepository, FindConditions, Repository } from 'typeorm';
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
      console.log('Updating values...');
      await UpdateManager.updateVeiculos(TipoVeiculo.carro);
      await UpdateManager.updateVeiculos(TipoVeiculo.moto);
      await UpdateManager.updateReferencia(lastReferenciaFromApi);
    } else {
      console.log('Updating is not necessary.');
      await UpdateManager.updateReferenciaLastCheck();
    }
  },

  shouldUpdate: (
    currentReferenciaInDatabase: Referencia,
    lastReferenciaFromApi: Referencia
  ): Boolean => {
    if (!currentReferenciaInDatabase) {
      return true;
    }

    if (lastReferenciaFromApi.ano > currentReferenciaInDatabase.ano) {
      return true;
    }

    if (lastReferenciaFromApi.mes > currentReferenciaInDatabase.mes) {
      return true;
    }

    return false;
  },

  updateReferenciaLastCheck: async (): Promise<Boolean> => {
    const referenciaRepository = getRepository(Referencia);

    await referenciaRepository.update(1, { lastCheck: new Date() });

    return true;
  },

  updateReferencia: async (referencia: Referencia): Promise<Boolean> => {
    const referenciaRepository = getRepository(Referencia);

    await referenciaRepository.clear();

    referencia.lastCheck = new Date();
    referencia.lastUpdate = new Date();

    await referenciaRepository.save(referencia);

    return true;
  },

  updateVeiculos: async (tipoVeiculo: TipoVeiculo): Promise<Boolean> => {
    const marcas = await UpdateManager.updateMarcas(tipoVeiculo);

    async.mapLimit(marcas, ASYNC_MAP_LIMIT, async (marca, callback) => {
      const modelos = await UpdateManager.updateModelos(tipoVeiculo, marca);

      async.mapLimit(modelos, ASYNC_MAP_LIMIT, async (modelo, callback) => {
        await UpdateManager.updateAnoModelo(tipoVeiculo, marca, modelo);
        callback();
      });

      callback();
    });

    return true;
  },

  updateMarcas: async (tipoVeiculo: TipoVeiculo): Promise<Marca[]> => {
    const marcaRepository = await getRepository(Marca);
    const marcasFromFipe = await FipeManager.getMarcas(tipoVeiculo);

    const marcas: Marca[] = [];

    for (const marcaFromFipe of marcasFromFipe) {
      const marca =
        (await marcaRepository.count({ idFipe: marcaFromFipe.idFipe })) === 0
          ? await marcaRepository.create(marcaFromFipe)
          : await marcaRepository.findOne({ idFipe: marcaFromFipe.idFipe });

      marcas.push(marca);
    }

    return marcas;
  },

  updateModelos: async (tipoVeiculo: TipoVeiculo, marca: Marca): Promise<Modelo[]> => {
    const modeloRepository = await getRepository(Modelo);
    const modelosFromFipe = await FipeManager.getModelos(tipoVeiculo, marca);

    const modelos: Modelo[] = [];

    for (const modeloFromFipe of modelosFromFipe) {
      const modelo =
        (await modeloRepository.count({ idFipe: modeloFromFipe.idFipe })) === 0
          ? await modeloRepository.create(modeloFromFipe)
          : await modeloRepository.findOne({ idFipe: modeloFromFipe.idFipe });

      modelos.push(modelo);
    }

    return modelos;
  },

  updateAnoModelo: async (tipoVeiculo: TipoVeiculo, marca: Marca, modelo: Modelo) => {
    const anoModeloRepository = await getRepository(AnoModelo);
    const preAnoModelosFromFipe = await FipeManager.getAnoModelos(tipoVeiculo, marca, modelo);

    preAnoModelosFromFipe.forEach(async preAnoModeloFromFipe => {
      const anoModeloFromFipe = await FipeManager.getAnoModelo(
        tipoVeiculo,
        marca,
        modelo,
        preAnoModeloFromFipe
      );

      const query: FindConditions<AnoModelo> = {
        codigoFipe: anoModeloFromFipe.codigoFipe,
        ano: anoModeloFromFipe.ano,
        combustivel: anoModeloFromFipe.combustivel,
      };

      if ((await anoModeloRepository.count(query)) === 0) {
        anoModeloRepository.create(anoModeloFromFipe);
      } else {
        anoModeloRepository.update(query, anoModeloFromFipe);
      }
    });
  },
};
