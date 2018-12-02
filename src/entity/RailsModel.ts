import { Column } from "typeorm";

export abstract class RailsModel {
  @Column({ name: "created_at" })
  public createdAt: Date;

  @Column({ name: "updated_at" })
  public updatedAt: Date;
}
