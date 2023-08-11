import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Users extends BaseModel {
  public static table = 'Users'

  @column()
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public mobNo: number

}
