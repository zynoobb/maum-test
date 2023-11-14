import { Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  userId: string;

  @Column()
  @Field(() => String)
  nickname: string;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  createdAt: Date;
}
