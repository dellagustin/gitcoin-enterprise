
import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class Task {
  @PrimaryColumn()
  public link: string

  @Column()
  public title: string

  @Column()
  public description: string

  @Column()
  public funding: number

  @Column()
  public status: string
}
