import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Answer } from 'src/apis/answers/entites/answer.entity';
import { Question } from 'src/apis/questions/entites/question.entity';
import { Survey } from 'src/apis/surveys/entites/survey.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @ManyToOne(() => Survey, (survey) => survey.surveyId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'surveyId' })
  @Field(() => Survey)
  survey: Survey;

  @ManyToOne(() => Question, (question) => question.questionId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  @Field(() => Question)
  question: Question;

  @OneToMany(() => Answer, (answer) => answer.choice)
  @Field(() => [Answer])
  answers: Answer[];
}
