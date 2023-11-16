import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Survey } from 'src/apis/surveys/entites/survey.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Question {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  questionId: number;

  @Column({ type: 'varchar', length: 300 })
  @Field(() => String)
  content: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Survey, (survey) => survey.surveyId)
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;
}
