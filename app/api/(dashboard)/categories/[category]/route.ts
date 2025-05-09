import connect from "@/lib/db";
import User from "@/lib/Models/User";
import Category from "@/lib/Models/Category";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { AnyAaaaRecord } from "dns";

export const PATCH = async (request : Request, context: {params:any}) =>{
    try {
        const categoryId = context.params.category;

        const body = await request.json();
        const {title} = body;

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({ message: "Invalid or missing User ID"}),
                {
                    status: 400
                }
            )
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({ message: "Invalid or missing Category ID"}),
                {
                    status: 400
                }
            )
        }

        await connect();

        const user = await User.findById(userId);

        if(!user){
            return new NextResponse(JSON.stringify({message: "User not found in the database"}),
                {
                    status: 404
                }
            )
        }

        const category = await Category.findOne({_id: categoryId, user: userId});

        if(!category){
            return new NextResponse(JSON.stringify({message: "Category not found in the database"}),
                {
                    status: 404
                }
            )
        }

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { title }, { new: true });

        return new NextResponse(JSON.stringify({
            message: "Category is updated",
            category: updatedCategory
        }),
        {
            status: 200
        }
    )
        
    } catch (error: any) {
        return new NextResponse(JSON.stringify({message: "Error in updating category" + error.message}),
            {
                status: 500
            }
        );
    }
}

export const DELETE = async ( request: Request, context: {params:any}) => {

    try {
        const categoryId = context.params.category;

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
    
        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({ message: "Invalid or missing User ID"}),
                {
                    status: 400
                }
            )
        }
    
        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({ message: "Invalid or missing Category ID"}),
                {
                    status: 400
                }
            )
        }
    
        await connect();

        const user = await User.findById(userId);

        if(!user){
            return new NextResponse(JSON.stringify({message: "User not found in the database"}),
                {
                    status: 404
                }
            )
        }

        const category = await Category.findOne({_id: categoryId, user: userId});

        if(!category){
            return new NextResponse(JSON.stringify({message: "Category not found in the database"}),
                {
                    status: 404
                }
            )
        }
        
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        return new NextResponse(JSON.stringify({
            message: "Category is deleted"
                }),
                {
                    status: 200
                }
            );

    } catch (error: any) {
        return new NextResponse(JSON.stringify({message: "Error in deleting Categorry" + error.message}),
        {
            status: 500
        }
    );
    } 
}