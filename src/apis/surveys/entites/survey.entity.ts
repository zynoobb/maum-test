import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Question } from 'src/apis/questions/entites/question.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Survey {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  surveyId: number;

  @Column({ type: 'varchar', length: 100 })
  @Field(() => String)
  subject: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @Field(() => String, { nullable: true })
  description: string | null;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @OneToMany(() => Question, (question) => question.survey)
  questions: Question[];
}
