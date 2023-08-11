// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Queue } from "@ioc:Rlanz/Queue";
import Users from "App/Models/main/Users";
export default class HomeController {
    public async index() {
        const id = 1
        console.log("Inside the loop")
        console.log("queue send:", id)
        await Queue.dispatch('App/Jobs/Emailsend', {
            Id:id
        });
        console.log("is this comming late?")
        return "End";
    }
}
