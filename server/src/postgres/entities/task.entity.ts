
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm'

@Entity()
export class Task {
  @PrimaryColumn()
  public link: string

  @Column()
  public title: string

  @Column()
  public description: number

  @Column()
  public funding: boolean

  @Column()
  public status: boolean
}
