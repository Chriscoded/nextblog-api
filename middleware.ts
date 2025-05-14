import { NextResponse } from "next/server";
import { authMiddleware } from "./Middlewares/api/authMiddleware";
import { logMiddleware } from "./Middlewares/api/logMiddleware";


export const config = {
    matcher: "/api/:path*",
};

export default function middleware(request: Request){
    if(request.url.includes("/api/blogs")){
        const logResult = logMiddleware(request);
        console.log(logResult.response);
    }

    const authResult = authMiddleware(request);
    // if(!authResult?.isValid && request.url.includes("/api/blogs")){
    if(!authResult?.isValid){
        return new NextResponse(
            JSON.stringify({ message: "Unauthorized" }),{
                status: 401
            }
        );
    }
    return NextResponse.next();
}