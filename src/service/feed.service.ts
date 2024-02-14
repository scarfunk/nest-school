import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteFeedDto, PostFeedDto, UpdateFeedDto } from '../dto/service.dto';
import { SchoolService } from './school.service';
import { SchoolFeed } from '../entity/school_feed.entity';
import { NewFeedEventProducer } from './new-feed.event.producer';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(SchoolFeed)
    private readonly schoolFeedRepository: Repository<SchoolFeed>,
    private schoolService: SchoolService,
    private newFeedEventProducer: NewFeedEventProducer,
  ) {}

  async postFeed(data: PostFeedDto): Promise<any> {
    const school = await this.schoolService.findSchoolIdByAdmin(data.adminId);
    const feed = this.schoolFeedRepository.create(data);
    feed.school = school;
    const savedFeed = await this.schoolFeedRepository.save(feed);
    // sub.{where: 학교} 구독 학생을 모두 찾아 student_id + feed_id 를 저장.
    const subs = await this.schoolService.findSubscribe(school.id);
    for (const sub of subs) {
      // 이벤트 큐로  발행.
      this.newFeedEventProducer.produce({ student: sub.student, savedFeed });
      console.log('NEW FEED!');
    }
    return savedFeed;
  }

  async updateFeed(data: UpdateFeedDto): Promise<any> {
    const school = await this.schoolService.findSchoolIdByAdmin(data.adminId);
    const feed = await this.schoolFeedRepository.findOneOrFail({
      where: { id: data.id, school: { id: school.id } },
    });
    feed.content = data.content;
    return await this.schoolFeedRepository.save(feed);
  }

  async deleteFeed(data: DeleteFeedDto): Promise<any> {
    const school = await this.schoolService.findSchoolIdByAdmin(data.adminId);
    return this.schoolFeedRepository.softDelete({
      id: data.id,
      school: { id: school.id },
    });
  }

  async getFeedBySchool(schoolId: number, studentId: number): Promise<any> {
    const sub = await this.schoolService.findSubscribe(schoolId, studentId);
    if (sub.length === 0) {
      throw new BadRequestException('Not subscribed');
    }
    const feeds = await this.schoolFeedRepository.find({
      where: { school: { id: sub[0].school.id } },
      order: { createdDate: 'DESC' },
    });
    return feeds;
  }
}
