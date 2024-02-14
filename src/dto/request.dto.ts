import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserRequest {
  @ApiProperty({ description: '계정 이름', required: true })
  @IsNotEmpty()
  name: string;
}

export class MakeSchoolRequest {
  @ApiProperty({ description: '학교 이름', required: true })
  @IsNotEmpty()
  name: string;
  @ApiProperty({ description: '학교 위치', required: true })
  @IsNotEmpty()
  location: string;
}

export class PostFeedRequest {
  @ApiProperty({ description: '피드 내용', required: true })
  @IsNotEmpty()
  content: string;
}

export class UpdateFeedRequest {
  @ApiProperty({ description: '피드 ID', required: true })
  @IsNotEmpty()
  id: number;
  @ApiProperty({ description: '피드 내용', required: true })
  @IsNotEmpty()
  content: string;
}

export class DeleteFeedRequest {
  @ApiProperty({ description: '피드 ID', required: true })
  @IsNotEmpty()
  id: number;
}

export class SubscribeSchoolRequest {
  @ApiProperty({ description: '학교 ID', required: true })
  @IsNotEmpty()
  schoolId: number;
}

export class UnSubscribeSchoolRequest {
  @ApiProperty({ description: '학교 ID', required: true })
  @IsNotEmpty()
  schoolId: number;
}
