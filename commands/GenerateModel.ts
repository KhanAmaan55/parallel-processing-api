import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import { join } from 'path'

export default class GenerateCrud extends BaseCommand {

  public static commandName = 'generate:model'

  public static description = 'Generate model of the given table from database'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  @args.string({ description: 'Name of the table to create model' })
  public moduleName: string

  @args.string({ description: 'Name of the Connection where module is connected' })
  public connectionName: string

  @args.string({ description: 'Name of the Folder where Model file will be stored' })
  public FolderName: string

 
  public async run() {
    const { default: Database } = await import('@ioc:Adonis/Lucid/Database')
    const client = Database.connection(this.connectionName)
    const envDbNumberObject = {
      "DbSecondary":"MYSQL_DB_NAME2",
      "DbVouchers":"MYSQL_DB_NAME3" 
    }
    const envDbNumber = envDbNumberObject[this.connectionName]
    const PascalCase = this.moduleName.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

    //Variable to generate files
    // const fields = await client.columnsInfo(this.moduleName) 
    const fields = await client.rawQuery(`DESCRIBE ${this.moduleName}`)
    const fieldColumns = fields[0].map(key => {
      const { Field, Type, Null, Key, Default,Extra } = key
      let fieldName = Field.replace(/_([a-z])/g, (m, p1) => p1.toUpperCase())
      let fieldType = 'string'
      let type = Type.split('(')[0]
      let migrationType = type
      let migrationOption = ''
      let columnOptions = '()'
      let increments = false
      if (type === 'int') {
        fieldType = 'number'
        migrationType = 'integer'
      }
      if (type === 'float') {
        fieldType = 'number'
        migrationType = 'float'
      }
      if (type === 'bigint') {
        fieldType = 'number'
        migrationType = 'bigInteger'
      }
      if (type === 'enum') {
        fieldType = Type.split('(')[1].split(')')[0].replace(/,/g, '|')
        migrationType = 'enu'
        migrationOption = ",[" + Type.split('(')[1].split(')')[0]+ "]"
         
      }
      if (type === 'timestamp' || type === 'datetime') {
        fieldType = 'DateTime'
        migrationType = 'timestamp'
        columnOptions = '.dateTime()'
      }
      if (type === 'varchar') {
        migrationType = 'string'
        let maxLength = parseInt(Type.split('(')[1].split(')')[0])
        if ( maxLength !==255) {
          migrationOption = `, ${maxLength}`
        }
      }
      if (type === 'mediumtext' || type === 'longtext') {
        migrationType = 'text'
        migrationOption =`, '${type}'`
      }
    
      if (Field === 'created_at' || Field === 'updated_at') {
        migrationOption =', { useTz: true }'
        columnOptions = '.dateTime({ autoCreate: true, autoUpdate: true })'
      }
      if (Field === 'id' && Null === 'NO') {
        columnOptions = '({ isPrimary: true })'
        increments = true
      }

      return { Field ,fieldName, fieldType , columnOptions, increments, migrationOption, migrationType}
    })
   
    // Generating Model and Migration
    this.generator
      .addFile(Math.floor(Date.now())+'_'+this.moduleName)
      .appRoot(this.application.appRoot)
      .destinationDir('database/migrations')
      .useMustache()
      .stub(join(__dirname, './templates/migration.txt'))
      .apply({ 
        moduleName: this.moduleName,
        envDbNumber : envDbNumber,
        columns: fieldColumns
      })
    this.generator
      .addFile(PascalCase)
      .appRoot(this.application.appRoot)
      .destinationDir(`app/Models/${this.FolderName}`)
      .useMustache()
      .stub(join(__dirname, './templates/model.txt'))
      .apply({
        PascalCase: PascalCase,
        moduleName: this.moduleName,
        connectionName: this.connectionName,
        columns: fieldColumns
      })

    await this.generator.run()
  }
}
