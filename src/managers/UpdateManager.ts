import { map } from "bluebird";
import { Connection, EntityManager, FindConditions } from "typeorm";

import { AnoModelo } from "../entity/AnoModelo";
import { Marca } from "../entity/Marca";
import { Modelo } from "../entity/Modelo";
import { Referencia } from "../entity/Referencia";
import { TipoVeiculo } from "../enums/TipoVeiculo";
import logger from "../infra/logger/logger";
import { FipeManager } from "./FipeManager";

const ASYNC_MAP_LIMIT = 20;

export class UpdateManager {
  private fipeManager: FipeManager;

  constructor(fipeManager: FipeManager) {
    this.fipeManager = fipeManager;
  }

  public init = async (connection: Connection) => {
    const queryRunner = connection.createQueryRunner();
    const manager = queryRunner.manager;

    const currentReferenciaInDatabase = await this.fipeManager.getCurrentReferenciaInDatabase(
      manager,
    );
    const lastReferenciaFromApi = await this.fipeManager.getLastReferenciaFromApi();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (this.shouldUpdate(currentReferenciaInDatabase, lastReferenciaFromApi)) {
        logger.info("Updating database...");
        await this.updateVeiculos(manager, TipoVeiculo.carro);
        await this.updateVeiculos(manager, TipoVeiculo.moto);
        await this.updateReferencia(manager, lastReferenciaFromApi);
      } else {
        logger.info("Database updated.");
        await this.updateReferenciaLastCheck(manager);
      }

      logger.info("Saving...");
      await queryRunner.commitTransaction();
    } catch (error) {
      logger.error(error);
      logger.info("Rollback transaction...");
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  public shouldUpdate = (
    currentReferenciaInDatabase: Referencia,
    lastReferenciaFromApi: Referencia,
  ): boolean => {
    if (!currentReferenciaInDatabase) {
      return true;
    }

    if (lastReferenciaFromApi.idFipe > currentReferenciaInDatabase.idFipe) {
      return true;
    }

    return false;
  }

  public updateReferenciaLastCheck = async (manager: EntityManager) => {
    manager.update(Referencia, 1, { lastCheck: new Date() });
  }

  public updateReferencia = async (manager: EntityManager, referencia: Referencia) => {
    await manager.clear(Referencia);

    referencia.lastCheck = new Date();
    referencia.lastUpdate = new Date();

    await manager.save(Referencia, referencia);
  }

  public updateVeiculos = async (manager: EntityManager, tipoVeiculo: TipoVeiculo) => {
    const marcas = await this.updateMarcas(manager, tipoVeiculo);

    await map(
      marcas,
      async (marca) => {
        const modelos = await this.updateModelos(manager, tipoVeiculo, marca);

        await map(
          modelos,
          async (modelo) => {
            await this.updateAnoModelo(manager, tipoVeiculo, marca, modelo);
          },
          { concurrency: ASYNC_MAP_LIMIT },
        );
      },
      { concurrency: ASYNC_MAP_LIMIT },
    );
  }

  public updateMarcas = async (
    manager: EntityManager,
    tipoVeiculo: TipoVeiculo,
  ): Promise<Marca[]> => {
    const marcasFromFipe = await this.fipeManager.getMarcas(tipoVeiculo);

    const marcas: Marca[] = [];

    for (const marcaFromFipe of marcasFromFipe) {
      const marca =
        (await manager.count(Marca, { idFipe: marcaFromFipe.idFipe })) === 0
          ? await manager.save(Marca, marcaFromFipe)
          : await manager.findOne(Marca, { idFipe: marcaFromFipe.idFipe });

      marcas.push(marca);
    }

    return marcas;
  }

  public updateModelos = async (
    manager: EntityManager,
    tipoVeiculo: TipoVeiculo,
    marca: Marca,
  ): Promise<Modelo[]> => {
    const modelosFromFipe = await this.fipeManager.getModelos(tipoVeiculo, marca);

    const modelos: Modelo[] = [];

    for (const modeloFromFipe of modelosFromFipe) {
      const modelo =
        (await manager.count(Modelo, { idFipe: modeloFromFipe.idFipe })) === 0
          ? await manager.save(Modelo, modeloFromFipe)
          : await manager.findOne(Modelo, { idFipe: modeloFromFipe.idFipe });

      modelos.push(modelo);
    }

    return modelos;
  }

  public updateAnoModelo = async (
    manager: EntityManager,
    tipoVeiculo: TipoVeiculo,
    marca: Marca,
    modelo: Modelo,
  ) => {
    const preAnoModelosFromFipe = await this.fipeManager.getAnoModelos(tipoVeiculo, marca, modelo);

    for (const preAnoModeloFromFipe of preAnoModelosFromFipe) {
      const anoModeloFromFipe = await this.fipeManager.getAnoModelo(
        tipoVeiculo,
        marca,
        modelo,
        preAnoModeloFromFipe,
      );

      const query: FindConditions<AnoModelo> = {
        ano: anoModeloFromFipe.ano,
        codigoFipe: anoModeloFromFipe.codigoFipe,
        combustivel: anoModeloFromFipe.combustivel,
      };

      logger.info(`${marca.nome} ${modelo.nome} ${anoModeloFromFipe.ano}`);

      if ((await manager.count(AnoModelo, query)) === 0) {
        await manager.save(AnoModelo, anoModeloFromFipe);
      } else {
        await manager.update(AnoModelo, query, anoModeloFromFipe);
      }
    }
  }
}
