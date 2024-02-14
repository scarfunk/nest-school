import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { School } from './school.entity';
import { StudentNewsFeed } from './student_news_feed.entity';

@Entity()
export class SchoolFeed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => School, (join) => join.feeds, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  school: School;

  @OneToMany(() => StudentNewsFeed, (join) => join.feed, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  newsFeeds: StudentNewsFeed[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn({ nullable: true })
  deletedDate: Date;
}
