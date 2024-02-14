import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { SchoolFeed } from './school_feed.entity';

@Entity()
export class StudentNewsFeed {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SchoolFeed, (join) => join.newsFeeds, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  feed: SchoolFeed;

  @ManyToOne(() => Student, (join) => join.newsFeeds, {
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
