import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { Admin } from '../entity/admin.entity';
import { CreateUserDto } from '../dto/service.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private authService: AuthService,
  ) {}

  async create(data: CreateUserDto): Promise<string> {
    const user = await this.adminRepository.save(data);
    return this.authService.createTokens({ id: user.id, isAdmin: true });
  }

  public async findAdmin(id: number) {
    const admin = await this.adminRepository.findOneOrFail({
      where: { id },
    });
    return admin;
  }
}
