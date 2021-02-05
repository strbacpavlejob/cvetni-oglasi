import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Flower } from "./flower.entity";
import * as Validator from "class-validator";

@Index("uq_user_email", ["email"], { unique: true })
@Index("uq_user_phone_number", ["phoneNumber"], { unique: true })
@Entity("user", { schema: "aplikacija" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", {
    name: "email",
    unique: true,
    length: 255,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsEmail({
    allow_ip_domain: false,
    allow_utf8_local_part: true,
    require_tld: true
  })
  email: string;

  @Column("varchar", {
    name: "password_hash",
    length: 128,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.IsHash('sha512')
  passwordHash: string;

  @Column("varchar", { name: "forename", length: 64, default: () => "'0'" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(2, 64)
  forename: string;

  @Column("varchar", { name: "surname", length: 64, default: () => "'0'" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(2, 64)
  surname: string;

  @Column("varchar", {
    name: "phone_number",
    unique: true,
    length: 24,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsPhoneNumber(null)
  phoneNumber: string;

  @Column("varchar", { name: "city", length: 32, default: () => "'0'" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(2, 32)
  city: string;

  @OneToMany(() => Flower, (flower) => flower.user)
  flowers: Flower[];
}
