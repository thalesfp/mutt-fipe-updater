import { BeforeInsert, BeforeUpdate, Column } from "typeorm";

export abstract class RailsModel {
  @Column({ name: "created_at" })
  public createdAt: Date;

  @Column({ name: "updated_at" })
  public updatedAt: Date;

  @BeforeInsert()
  public updateCreatedAtAndUpdatedAt() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  public updateUpdatedAt() {
    this.updatedAt = new Date();
  }
}
