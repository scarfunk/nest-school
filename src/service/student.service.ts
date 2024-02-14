import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/service.dto';
import { Student } from '../entity/student.entity';
import { StudentNewsFeed } from '../entity/student_news_feed.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(StudentNewsFeed)
    private readonly newsRepository: Repository<StudentNewsFeed>,
    private authService: AuthService,
  ) {}

  async create(data: CreateUserDto): Promise<any> {
    const user = await this.studentRepository.save(data);
    return this.authService.createTokens({ id: user.id, isAdmin: false });
  }

  async findStudentById(id: number): Promise<any> {
    return this.studentRepository.findOneOrFail({
      select: ['id'],
      where: { id },
    });
  }

  async getAllNewsFeed(id: number): Promise<any> {
    const news = await this.newsRepository.find({
      where: { student: { id } },
      relations: ['feed'],
      order: { createdDate: 'DESC' },
    });
    return news.map((n) => n.feed);
  }
}
