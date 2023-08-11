import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class extends BaseSchema {
  protected tableName =  `${Env.get('')}.Users`

  public async up () {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.integer('Id')
      table.string('Name', 11)
      table.string('Email', 11)
      table.integer('MobNo')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}