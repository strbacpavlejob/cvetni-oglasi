import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./category.entity";
import { User } from "./user.entity";
import { Picture } from "./picture.entity";
import * as Validator from "class-validator";

@Index("fk_flower_category_id", ["categoryId"], {})
@Index("fk_flower_user_id", ["userId"], {})
@Entity("flower", { schema: "aplikacija" })
export class Flower {
  @PrimaryGeneratedColumn({ type: "int", name: "flower_id", unsigned: true })
  flowerId: number;

  @Column("varchar", { name: "name", length: 128, default: () => "'0'" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(1, 128)
  name: string;
  
  @Column("int", { name: "size", default: () => "'0'" })
  @Validator.IsPositive()
  @Validator.IsNotEmpty()
  @Validator.IsNumber({
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0
    })
  size: number;

  @Column("enum", {
    name: "lifetime",
    enum: ["seasonal", "annual", "perennial"],
    default: () => "'seasonal'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.IsIn([ "seasonal", "annual", "perennial" ])
  lifetime: "seasonal" | "annual" | "perennial";

  @Column("decimal", {
    name: "price",
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  @Validator.IsPositive()
  @Validator.IsNotEmpty()
  @Validator.IsNumber({
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 2
    })
  price: string;

  @Column("text", { name: "description" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(20, 10000)
  description: string;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp", { name: "expired_at" })
  expiredAt: Date;

  @Column("int", { name: "category_id", unsigned: true })
  categoryId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", { name: "country", length: 45 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(2, 45)
  country: string;

  @Column("varchar", { name: "color", length: 24 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3, 24)
  color: string;

  @ManyToOne(() => Category, (category) => category.flowers, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: Category;

  @ManyToOne(() => User, (user) => user.flowers, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;

  @OneToMany(() => Picture, (picture) => picture.flower)
  pictures: Picture[];
}
