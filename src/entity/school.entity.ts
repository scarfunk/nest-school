import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Admin } from './admin.entity';
import { SchoolFeed } from './school_feed.entity';
import { StudentSchoolSubscribe } from './student_school_subscribe.entity';

@Entity()
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @OneToOne(() => Admin, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  admin: Admin;

  @OneToMany(() => SchoolFeed, (join) => join.school, {
    createForeignKeyConstraints: false,
  })
  feeds: SchoolFeed[];

  @OneToMany(() => StudentSchoolSubscribe, (join) => join.school, {
    createForeignKeyConstraints: false,
  })
  subscribes: StudentSchoolSubscribe[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn({ nullable: true })
  deletedDate: Date;
}
