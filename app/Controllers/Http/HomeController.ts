// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Queue } from "@ioc:Rlanz/Queue";
import SendEmailJob from "App/Jobs/Emailsend";
import Users from "App/Models/main/Users";
export default class HomeController {
    public async index() {
        const users = await Users.first()
        console.log("Inside the loop")
        console.log("queue send:", users?.id)
        await Queue.dispatch('App/Jobs/Emailsend', {
            Id:users?.id
        });
        console.log("is this comming late?")
        return "End";
    }
}
