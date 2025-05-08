import connect from "@/lib/db";
import User from "@/lib/Models/User";
import Category from "@/lib/Models/Category";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    try{
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({ message: "Invalid or missing User ID"}),
                {status: 400}
            )
        }

        await connect();

        const user = await User.findById(userId);

        if(!user){
            return new NextResponse(
                JSON.stringify({message: "User not found in the database"}),
                {
                    status: 404
                }
            )
            
        }

        const categories = await Category.find({
            user: new Types.ObjectId(userId)
        });

        if(!categories){
            return new NextResponse(
                JSON.stringify({message: "Category for the selected user can not be fornd"}),
                {
                    status: 404
                }
            )
        }
        
        return new NextResponse(
            JSON.stringify({category: categories}),
            {
                
                status:200
            }
        )
    } catch(error: any){
        return new NextResponse(
            JSON.stringify({message: "Error in fetching data"}),
            {
                status: 500
            }
        )
    }

}