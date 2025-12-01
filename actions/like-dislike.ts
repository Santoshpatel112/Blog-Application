"use server"
import { prisma } from "@/lib/prisma";
import {auth} from "@clerk/nextjs/server";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { use } from "react";

export const LikeDislike=async (articleId:string)=>{
const {userId}=await auth();
if(!userId){
    throw Error (
        "you must have login"
    );
}
    const user= await prisma.user.findUnique({
        where :{
            clearkUserId:userId
        }
    });

    if(!user){
        throw Error("User does't exit in the database");
    }
    const exitingLike=await prisma.like.findFirst({
        where:{articleId,userId:user.id}
    })
    if(exitingLike){
        // dislike
        await prisma.like.delete({
            where:{id:exitingLike.id},
        })
    }
    else{
        await prisma.like.create({
            data:{articleId,userId:user.id},
        })
    }
    revalidatePath(`/articles/${articleId}`)
}