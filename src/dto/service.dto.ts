export class CreateUserDto {
  name: string;
}

export class MakeSchoolDto {
  name: string;
  location: string;
  adminId: number;
}

export class PostFeedDto {
  content: string;
  adminId: number;
}

export class UpdateFeedDto {
  id: number;
  content: string;
  adminId: number;
}

export class DeleteFeedDto {
  id: number;
  adminId: number;
}

export class SubscribeSchoolDto {
  schoolId: number;
  studentId: number;
}

export class UnSubscribeSchoolDto {
  schoolId: number;
  studentId: number;
}
