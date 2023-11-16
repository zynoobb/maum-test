import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Question } from 'src/apis/questions/entites/question.entity';
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
export class Choice {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  choiceId: number;

  @Column({ type: 'varchar', length: 300 })
  @Field(() => String)
  choiceContent: string;

  @Column()
  @Field(() => Int)
  choiceScore: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Question, (question) => question.questionId)
  @JoinColumn({ name: 'questionId' })
  question: Question;
}
