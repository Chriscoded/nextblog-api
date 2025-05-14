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
        const searchKeywords = searchParams.get("keywords") as string;
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const order = searchParams.get("order") as string;



        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({ message: "Invalid or missing User ID"}),
                {status: 400}
            )
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({ message: "Invalid or missing Category ID"}),
                {status: 400}
            )
        }
    
        await connect();
        const user = await User.findById(userId);

        if(!user){
            return new NextResponse(
                JSON.stringify({message: "User not found"}),
                {
                    status: 404
                }
            )
            
        }

        const category = await Category.findById(categoryId);
        if(!category){
            return new NextResponse(
                JSON.stringify({message: "Category not found"}),
                {
                    status: 404
                }
            )
            
        }           

        const filter: any = {
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId)
        };

        if(searchKeywords){

            //$options: 'i' means it's case insensitive whether it's found on lower or upper case it will be retrieved
            filter.$or = [
                {
                    title: {$regex: searchKeywords, $options: 'i' }
                },
                {
                    description: {$regex: searchKeywords, $options: 'i' }
                }
            ]
        }

        if(startDate && endDate){
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        else if(startDate){
            filter.createdAt = {
                $gte: new Date(startDate)
            };
        }
        else if(endDate){
            filter.createdAt = {
                $lte: new Date(endDate)
            };
        }

        //TODO

            const skip = (page - 1) * limit;

            const blogs = await Blog.find(filter)
                .sort({createdAt: order == "asc" ? "asc": "desc"})
                .skip(skip)
                .limit(limit);

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

export const POST = async (request: Request) =>{
    try {
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        const body = await request.json();
        const { title, description } = body;

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({ message: "Invalid or missing User ID"}),
                {status: 400}
            )
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({ message: "Invalid or missing Category ID"}),
                {status: 400}
            )
        }
    
        await connect();
        const user = await User.findById(userId);

        if(!user){
            return new NextResponse(
                JSON.stringify({message: "User not found"}),
                {
                    status: 404
                }
            )
            
        }

        const category = await Category.findById(categoryId);
        if(!category){
            return new NextResponse(
                JSON.stringify({message: "Category not found"}),
                {
                    status: 404
                }
            );
        }   
        
        const newBlog = new Blog({
            title,
            description,
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId),
        })

        await newBlog.save();
        return new NextResponse(
            JSON.stringify({ message: "Blog is created", blog: newBlog }),
            { status: 200}
        )
    } catch (error: any) {
        return new NextResponse(JSON.stringify({message: "Error in creating blog" + error.message}),
        {
            status: 500
        });
    }
}