import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { StudentService } from '../service/student.service';
import { ApiRole, DecodedAccToken } from '../common/decorators';
import { AuthorizationType } from '../common/enums';
import { AuthenticationGuard, AuthorizationGuard } from '../common/auth.guard';
import { JwtPayload } from 'jsonwebtoken';
import { SchoolService } from '../service/school.service';
import { FeedService } from '../service/feed.service';
import {
  RegisterUserRequest,
  SubscribeSchoolRequest,
  UnSubscribeSchoolRequest,
} from '../dto/request.dto';
import {
  CreatedResponse,
  FeedResponse,
  SchoolResponse,
} from '../dto/response.dto';
import { Serialize } from '../common/serialize-out.interceptor';

@ApiTags('student')
@Controller('/student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly schoolService: SchoolService,
    private readonly feedService: FeedService,
  ) {}

  @ApiOperation({ summary: '학생 생성+토큰' })
  @ApiOkResponse({ type: String })
  @Post('/register')
  async registerUser(@Body() dto: RegisterUserRequest) {
    return this.studentService.create(dto);
  }

  @ApiOperation({ summary: '학교 구독' })
  @ApiOkResponse({ type: CreatedResponse })
  @Serialize(CreatedResponse)
  @Post('/subscribe-school')
  @ApiRole(AuthorizationType.Student)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async subscribeSchool(
    @Body() dto: SubscribeSchoolRequest,
    @DecodedAccToken() payload: JwtPayload,
  ) {
    const data = { ...dto, studentId: payload.id };
    return this.schoolService.subscribeSchool(data);
  }

  @ApiOperation({ summary: '학교 해지' })
  @ApiNoContentResponse()
  @Delete('/unsubscribe-school')
  @ApiRole(AuthorizationType.Student)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async unsubscribeSchool(
    @Body() dto: UnSubscribeSchoolRequest,
    @DecodedAccToken() payload: JwtPayload,
  ) {
    const data = { ...dto, studentId: payload.id };
    return this.schoolService.unsubscribeSchool(data);
  }

  @ApiOperation({ summary: '구독 학교 리스트' })
  @ApiOkResponse({ type: SchoolResponse, isArray: true })
  @Serialize(SchoolResponse)
  @Get('/schools')
  @ApiRole(AuthorizationType.Student)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async listSchools(@DecodedAccToken() payload: JwtPayload) {
    return this.schoolService.listSchools(payload.id);
  }

  @ApiOperation({ summary: '구독 학교 피드 리스트' })
  @ApiOkResponse({ type: FeedResponse, isArray: true })
  @Serialize(FeedResponse)
  @Get('/feed-by-school/:schoolId')
  @ApiRole(AuthorizationType.Student)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async feedBySchool(
    @Param('schoolId') schoolId: number,
    @DecodedAccToken() payload: JwtPayload,
  ) {
    return this.feedService.getFeedBySchool(schoolId, payload.id);
  }

  @ApiOperation({ summary: '내 뉴스 리스트' })
  @ApiOkResponse({ type: FeedResponse, isArray: true })
  @Serialize(FeedResponse)
  @Get('/news-feed')
  @ApiRole(AuthorizationType.Student)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async newsFeed(@DecodedAccToken() payload: JwtPayload) {
    return this.studentService.getAllNewsFeed(payload.id);
  }
}
