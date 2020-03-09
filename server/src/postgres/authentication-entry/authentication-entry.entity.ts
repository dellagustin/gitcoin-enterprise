
import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class AuthenticationEntry {
  @PrimaryColumn()
  public id: string

  @Column()
  public p2pAccessToken: boolean

  @Column()
  public avatarURL: string

  @Column()
  public login: string

}
