import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm'

@Entity()
export class LedgerEntry {
  @PrimaryColumn()
  public id: string

  @Column()
  public date: string

  @Column()
  public amount: number

  @Column()
  public sender: string

  @Column()
  public receiver: string
}
