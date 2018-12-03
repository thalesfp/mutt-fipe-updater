import { map } from "bluebird";
import { Connection, EntityManager, FindConditions } from "typeorm";

import { AnoModelo } from "../entity/AnoModelo";
import { Marca } from "../entity/Marca";
import { Modelo } from "../entity/Modelo";
import { Referencia } from "../entity/Referencia";
import { TipoVeiculo } from "../enums/TipoVeiculo";
import logger from "../infra/logger/logger";
import { FipeManager } from "./FipeManager";
import { ReferenciaManager } from "./ReferenciaManager";

const ASYNC_MAP_LIMIT = 20;

export class UpdateManager {
  public init = async (connection: Connection) => {
    const queryRunner = connection.createQueryRunner();
    const manager = queryRunner.manager;

    try {
      const referenciaManager = new ReferenciaManager(manager);
      const currentReferencia = await referenciaManager.getCurrentReferencia();
      const lastReferenciaFromApi = await referenciaManager.getLastReferenciaFromApi();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (this.shouldUpdate(currentReferencia, lastReferenciaFromApi)) {
        logger.info("Updating database...");
        const fipeManager = new FipeManager(lastReferenciaFromApi.idFipe);

        await this.updateVeiculos(manager, fipeManager, TipoVeiculo.carro);
        await this.updateVeiculos(manager, fipeManager, TipoVeiculo.moto);
        await referenciaManager.createReferencia(lastReferenciaFromApi);
      } else {
        logger.info("Database already updated.");
        await referenciaManager.updateReferencia(currentReferencia);
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
    currentReferencia: Referencia,
    lastReferenciaFromApi: Referencia,
  ): boolean => {
    if (!currentReferencia) {
      return true;
    }

    if (lastReferenciaFromApi.idFipe > currentReferencia.idFipe) {
      return true;
    }

    return false;
  }

  public updateVeiculos = async (
    manager: EntityManager,
    fipeManager: FipeManager,
    tipoVeiculo: TipoVeiculo,
  ) => {
    const marcas = await this.updateMarcas(manager, fipeManager, tipoVeiculo);

    await map(
      marcas,
      async (marca) => {
        const modelos = await this.updateModelos(manager, fipeManager, tipoVeiculo, marca);

        await map(
          modelos,
          async (modelo) => {
            await this.updateAnoModelo(manager, fipeManager, tipoVeiculo, marca, modelo);
          },
          { concurrency: ASYNC_MAP_LIMIT },
        );
      },
      { concurrency: ASYNC_MAP_LIMIT },
    );
  }

  public updateMarcas = async (
    manager: EntityManager,
    fipeManager: FipeManager,
    tipoVeiculo: TipoVeiculo,
  ): Promise<Marca[]> => {
    const marcasFromFipe = await fipeManager.getMarcas(tipoVeiculo);

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
    fipeManager: FipeManager,
    tipoVeiculo: TipoVeiculo,
    marca: Marca,
  ): Promise<Modelo[]> => {
    const modelosFromFipe = await fipeManager.getModelos(tipoVeiculo, marca);

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
    fipeManager: FipeManager,
    tipoVeiculo: TipoVeiculo,
    marca: Marca,
    modelo: Modelo,
  ) => {
    const preAnoModelosFromFipe = await fipeManager.getAnoModelos(tipoVeiculo, marca, modelo);

    for (const preAnoModeloFromFipe of preAnoModelosFromFipe) {
      const anoModeloFromFipe = await fipeManager.getAnoModelo(
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

      if ((await manager.count(AnoModelo, query)) === 0) {
        await manager.save(AnoModelo, anoModeloFromFipe);
      } else {
        await manager.update(AnoModelo, query, {
          valor: anoModeloFromFipe.valor,
        });
      }
    }
  }
}
