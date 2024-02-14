import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from '../service/admin.service';
import { ApiRole, DecodedAccToken } from '../common/decorators';
import { JwtPayload } from 'jsonwebtoken';
import { AuthorizationType } from '../common/enums';
import { AuthenticationGuard, AuthorizationGuard } from '../common/auth.guard';
import { SchoolService } from '../service/school.service';
import { FeedService } from '../service/feed.service';
import {
  DeleteFeedRequest,
  MakeSchoolRequest,
  PostFeedRequest,
  RegisterUserRequest,
  UpdateFeedRequest,
} from '../dto/request.dto';
import { CreatedResponse } from '../dto/response.dto';
import { TOKEN_HEADER_KEY } from '../common/constants';
import { Serialize } from '../common/serialize-out.interceptor';

@ApiSecurity(TOKEN_HEADER_KEY)
@ApiTags('admin')
@Controller('/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly schoolService: SchoolService,
    private readonly feedService: FeedService,
  ) {}

  @ApiOperation({ summary: '관리자 생성+토큰' })
  @ApiOkResponse({ type: String })
  @Post('/register')
  async registerUser(@Body() dto: RegisterUserRequest): Promise<string> {
    return this.adminService.create(dto);
  }

  @ApiOperation({ summary: '학교 생성' })
  @ApiOkResponse({ type: CreatedResponse })
  @Serialize(CreatedResponse)
  @Post('/make-school')
  @ApiRole(AuthorizationType.Admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async makeSchool(
    @Body() dto: MakeSchoolRequest,
    @DecodedAccToken() payload: JwtPayload,
  ) {
    const data = { ...dto, adminId: payload.id };
    return this.schoolService.makeSchool(data);
  }

  @ApiOperation({ summary: '학교 피드 게시' })
  @ApiOkResponse({ type: CreatedResponse })
  @Serialize(CreatedResponse)
  @Post('/post-feed')
  @ApiRole(AuthorizationType.Admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async postFeed(
    @Body() dto: PostFeedRequest,
    @DecodedAccToken() payload: JwtPayload,
  ) {
    const data = { ...dto, adminId: payload.id };
    return this.feedService.postFeed(data);
  }

  @ApiOperation({ summary: '학교 피드 수정' })
  @ApiNoContentResponse()
  @Patch('/update-feed')
  @ApiRole(AuthorizationType.Admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async updateFeed(
    @Body() dto: UpdateFeedRequest,
    @DecodedAccToken() payload: JwtPayload,
  ) {
    const data = { ...dto, adminId: payload.id };
    return this.feedService.updateFeed(data);
  }
  @ApiOperation({ summary: '학교 피드 삭제' })
  @ApiNoContentResponse()
  @Delete('/delete-feed')
  @ApiRole(AuthorizationType.Admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async deleteFeed(
    @Body() dto: DeleteFeedRequest,
    @DecodedAccToken() payload: JwtPayload,
  ) {
    const data = { ...dto, adminId: payload.id };
    return this.feedService.deleteFeed(data);
  }
}
