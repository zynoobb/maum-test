import { Field, ObjectType } from '@nestjs/graphql';
import { Answer } from 'src/apis/answers/entites/answer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
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

  @OneToMany(() => Answer, (answer) => answer.user)
  @Field(() => [Answer])
  answers: Answer[];
}
