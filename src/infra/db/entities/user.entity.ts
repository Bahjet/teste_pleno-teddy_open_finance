import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Url } from './url.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  password: string

  @OneToMany(() => Url, (url) => url.user)
  urls: Url[]
}
