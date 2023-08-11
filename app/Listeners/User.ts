import type { EventsList } from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'
import Users from 'App/Models/main/Users';
import Env from '@ioc:Adonis/Core/Env'

export default class User {
    public async onNewUser(user: EventsList['new:user']) {
      const userMail = await Users.find(user.id)
      // console.log(userMail);
        const res = await Mail.send((message) => {
            message
              .from(Env.get('SENDER_MAIL'))
              .to(userMail.email)
              .subject("Event Mail").html(`Mail works`);
          });
          if (res.accepted.length > 0) {
            console.log("success");
          }
        else {
          console.log("User with the email not exists" );
        }
    }
}
