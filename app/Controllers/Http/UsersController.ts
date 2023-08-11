import Event from '@ioc:Adonis/Core/Event'
import Users from 'App/Models/main/Users'

export default class UsersController {
  public async index() {
    Event.emit('new:user', { id: 1 })
    return "hello"
  }
}
