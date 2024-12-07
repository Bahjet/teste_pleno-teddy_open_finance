import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm'
import { User } from './user.entity'

@Entity('urls')
@Unique(['url', 'userId', 'deletedAt'])
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  url: string

  @Column({ nullable: true })
  userId: string

  @Column()
  urlShort: string

  @ManyToOne(() => User, (user) => user.urls)
  user: User

  @Column({ default: 0 })
  clicks: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
