import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  @Field(() => String)
  nickname: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
