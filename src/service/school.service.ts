import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from '../entity/school.entity';
import {
  MakeSchoolDto,
  SubscribeSchoolDto,
  UnSubscribeSchoolDto,
} from '../dto/service.dto';
import { AdminService } from './admin.service';
import { StudentService } from './student.service';
import { StudentSchoolSubscribe } from '../entity/student_school_subscribe.entity';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
    @InjectRepository(StudentSchoolSubscribe)
    private readonly subscribeRepository: Repository<StudentSchoolSubscribe>,
    private adminService: AdminService,
    private studentService: StudentService,
  ) {}

  async makeSchool(data: MakeSchoolDto): Promise<any> {
    const admin = await this.adminService.findAdmin(data.adminId);
    const exist = await this.schoolRepository.findOne({
      where: { admin: { id: admin.id } },
    });
    if (exist) {
      throw new BadRequestException('관리자에게 이미 학교가 있습니다.(1:1)');
    }
    const school = this.schoolRepository.create(data);
    school.admin = admin;
    return this.schoolRepository.save(school);
  }

  public async findSchoolIdByAdmin(adminId: number) {
    const school = await this.schoolRepository.findOneOrFail({
      select: ['id'],
      where: { admin: { id: adminId } },
    });
    return school;
  }

  async subscribeSchool(data: SubscribeSchoolDto): Promise<any> {
    const { studentId, schoolId } = data;
    const student = await this.studentService.findStudentById(studentId);
    const school = await this.schoolRepository.findOneOrFail({
      select: ['id'],
      where: { id: schoolId },
    });
    const exist = await this.subscribeRepository.findOne({
      select: ['id'],
      where: { student: { id: student.id }, school: { id: school.id } },
    });
    if (exist) {
      throw new BadRequestException('Already subscribed');
    }
    const sub = this.subscribeRepository.create({ student, school });
    return this.subscribeRepository.save(sub);
  }

  async unsubscribeSchool(data: UnSubscribeSchoolDto): Promise<any> {
    const { studentId, schoolId } = data;
    const student = await this.studentService.findStudentById(studentId);
    const school = await this.schoolRepository.findOneOrFail({
      select: ['id'],
      where: { id: schoolId },
    });
    const sub = await this.subscribeRepository.findOneOrFail({
      select: ['id'],
      where: { student: { id: student.id }, school: { id: school.id } },
    });
    return this.subscribeRepository.softDelete({ id: sub.id });
  }

  listSchools(studentId: number): Promise<any> {
    return this.subscribeRepository.find({
      where: { student: { id: studentId } },
      relations: ['school'],
    });
  }

  async findSubscribe(schoolId: number, studentId?: number) {
    return this.subscribeRepository.find({
      where: { student: { id: studentId }, school: { id: schoolId } },
      relations: ['student', 'school'],
    });
  }
}
