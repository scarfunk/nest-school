import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudentSchoolSubscribe } from './student_school_subscribe.entity';
import { StudentNewsFeed } from './student_news_feed.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => StudentSchoolSubscribe, (join) => join.student, {
    createForeignKeyConstraints: false,
  })
  subscribes: StudentSchoolSubscribe[];

  @OneToMany(() => StudentNewsFeed, (join) => join.student, {
    createForeignKeyConstraints: false,
  })
  newsFeeds: StudentNewsFeed[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn({ nullable: true })
  deletedDate: Date;
}
