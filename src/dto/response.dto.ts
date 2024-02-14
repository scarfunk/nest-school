import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreatedResponse {
  @ApiProperty({ description: '생성 ID', required: true })
  @Expose()
  @IsNotEmpty()
  id: number;
}

export class SchoolResponse {
  @ApiProperty({ description: '학교 ID', required: true })
  @Expose()
  @IsNotEmpty()
  id: number;
  @ApiProperty({ description: '학교 이름', required: true })
  @Expose()
  @IsNotEmpty()
  name: string;
  @ApiProperty({ description: '학교 주소', required: true })
  @Expose()
  @IsNotEmpty()
  location: string;
}

export class FeedResponse {
  @ApiProperty({ description: '피드 ID', required: true })
  @IsNotEmpty()
  id: number;
  @ApiProperty({ description: '피드 내용', required: true })
  @IsNotEmpty()
  content: string;
}

export class DeleteFeedResponse {
  @ApiProperty({ description: '피드 ID', required: true })
  @IsNotEmpty()
  id: number;
}

export class SubscribeSchoolResponse {
  @ApiProperty({ description: '학교 ID', required: true })
  @IsNotEmpty()
  schoolId: number;
}

export class UnSubscribeSchoolResponse {
  @ApiProperty({ description: '학교 ID', required: true })
  @IsNotEmpty()
  schoolId: number;
}
