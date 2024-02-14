import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { School } from './school.entity';
import { Student } from './student.entity';

@Entity()
export class StudentSchoolSubscribe {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => School, (join) => join.subscribes, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  school: School;

  @ManyToOne(() => Student, (join) => join.subscribes, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  student: Student;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn({ nullable: true })
  deletedDate: Date;
}
