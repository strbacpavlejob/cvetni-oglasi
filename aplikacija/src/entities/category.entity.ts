import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Flower } from "./flower.entity";
import * as Validator from "class-validator";

@Index("uq_category_name", ["name"], { unique: true })
@Index("uq_category_image_path", ["imagePath"], { unique: true })
@Entity("category", { schema: "aplikacija" })
export class Category {
  @PrimaryGeneratedColumn({ type: "int", name: "category_id", unsigned: true })
  categoryId: number;

  @Column("varchar", {
    name: "name",
    unique: true,
    length: 32,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(1, 32)
  name: string;

  @Column("varchar", {
    name: "image_path",
    unique: true,
    length: 128,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(1, 128)
  imagePath: string;

  @OneToMany(() => Flower, (flower) => flower.category)
  flowers: Flower[];
}
