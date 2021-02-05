import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Flower } from "./flower.entity";
import * as Validator from "class-validator";

@Index("fk_picture_flower_id", ["flowerId"], {})
@Index("uq_picture_image_path", ["imagePath"], { unique: true })
@Entity("picture", { schema: "aplikacija" })
export class Picture {
  @PrimaryGeneratedColumn({ type: "int", name: "picture_id", unsigned: true })
  pictureId: number;

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

  @Column("tinyint", {
    name: "is_primary",
    unsigned: true,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsIn([ 0, 1 ])
  isPrimary: number;

  @Column("int", { name: "flower_id", unsigned: true })
  flowerId: number;

  @ManyToOne(() => Flower, (flower) => flower.pictures, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "flower_id", referencedColumnName: "flowerId" }])
  flower: Flower;
}
