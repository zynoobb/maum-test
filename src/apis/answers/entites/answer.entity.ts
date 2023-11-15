import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Survey } from 'src/apis/surveys/entites/survey.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Answer {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  answerId: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  totalScore: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Survey, (survey) => survey.surveyId)
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;
}
