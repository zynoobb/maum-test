import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './entites/survey.entity';
import { SurveysResolver } from './surveys.resolver';
import { SurveysService } from './surveys.service';

@Module({
  imports: [TypeOrmModule.forFeature([Survey])],
  providers: [SurveysResolver, SurveysService],
  exports: [SurveysService],
})
export class SurveysModule {}
