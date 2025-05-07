import connect from "@/lib/db";
import User from "@/lib/Models/User";
import { NextResponse } from "next/server"

export const GET = async () => {

    try{
        await connect();
        const users = await User.find();
    return new NextResponse( JSON.stringify(users), {status: 200});
    
    } catch(error:any){
        return new NextResponse( "An error occured In fetching users" + error.message, {status: 500});
    }

}

export const POST = async (request: Request) =>{
    try{
        const body = await request.json();
    }
    catch(error: any){

    }
}