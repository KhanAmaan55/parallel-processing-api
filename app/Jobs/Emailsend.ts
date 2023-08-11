// app/Jobs/SendEmailJob.js

import type { JobHandlerContract, Job } from '@ioc:Rlanz/Queue'
import Users from 'App/Models/main/Users'
export type SendEmailPayload = {
  Id: string
}

export default class SendEmailJob implements JobHandlerContract {

  constructor (public job: Job) {
    this.job = job
  }

  /**
   * Handle job
   */
  public async handle (payload: SendEmailPayload) {
    const id  = payload.Id
    console.log("payload",payload)
    console.log("id",payload.Id)
    const user = await Users.find(id);
    if (user) {
      // Update the user's name
      user.name = "oldName";
      await user.save();
      console.log('User name updated successfully');
    } else {
      console.log('User not found');
    }
    console.log('name change of to user', user?.id)
  }

  /**
   * Optional failed method
   */
  public async failed () {
    console.log('Sending email job failed') 
  }

}