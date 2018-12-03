import { EntityManager } from "typeorm";

import { adaptReferencia } from "../adapters/adaptFromFipeApi";
import { Referencia } from "../entity/Referencia";
import { ReferenciasResponseType } from "../interfaces/FipeResponseTypes";
import FipeService from "../services/FipeService";

export class ReferenciaManager {
  private manager: EntityManager;

  constructor(manager: EntityManager) {
    this.manager = manager;
  }

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

  public getCurrentReferencia = async (): Promise<Referencia> => {
    return await this.manager.findOne(Referencia, { order: { idFipe: "DESC" } });
  }

  public createReferencia = async (referencia: Referencia) => {
    await this.manager.save(Referencia, referencia);
  }

  public updateReferencia = async (referencia: Referencia) => {
    await this.manager.update(Referencia, referencia.id, { idFipe: referencia.idFipe });
  }
}
