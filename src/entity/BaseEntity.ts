import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity {
  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date;
}
