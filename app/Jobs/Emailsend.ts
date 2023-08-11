// app/Jobs/SendEmailJob.js

import type { JobHandlerContract, Job } from '@ioc:Rlanz/Queue'
import Users from 'App/Models/main/Users'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

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
      const res = await Mail.send((message) => {
        message
          .from(Env.get('SENDER_MAIL'))
          .to(user.email)
          .subject("is it working").html(`mail works`);
      });
      if (res.accepted.length > 0) {
        console.log("Success");
    } else {
     console.log("User with the email not exists" );
    }
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