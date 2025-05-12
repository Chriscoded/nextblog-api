import connect from "@/lib/db";
import User from "@/lib/Models/User";
import Category from "@/lib/Models/Category";
import Blog from "@/lib/Models/blog";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    try {
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({ message: "Invalid or missing User ID"}),
                {status: 400}
            )
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
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

        const category = await Category.findById(categoryId);
        if(!category){
            return new NextResponse(
                JSON.stringify({message: "Category not found in the database"}),
                {
                    status: 404
                }
            )
            
        }           

        const filter: any = {
            user: new Types.ObjectId(userId),
            categoryId: new Types.ObjectId(categoryId)
        };
        
        const blogs = await Blog.find(filter);

        return new NextResponse(JSON.stringify({blogs}),{
            status: 200,
        });

    } catch (error: any) {
        return new NextResponse(JSON.stringify({message: "Error in fetching blogs" + error.message}),
        {
            status: 500
        }
    );
    }
}