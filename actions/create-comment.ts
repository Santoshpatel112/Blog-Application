"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth, currentUser } from "@clerk/nextjs/server";

const createCommentSchema = z.object({
  body: z.string().min(1, "Comment cannot be empty"),
});

type CreateCommentFormState = {
  errors: {
    body?: string[];
    formErrors?: string[];
  };
};

export const createComments = async (
  articleId: string,
  prevState: CreateCommentFormState,
  formData: FormData
): Promise<CreateCommentFormState> => {
  const result = createCommentSchema.safeParse({
    body: formData.get("body") as string,
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // Get current user from Clerk
    const { userId: clerkUserId } = await auth();
    
    let existingUser;

    if (clerkUserId) {
      // Find or create user in database
      existingUser = await prisma.user.findUnique({
        where: { clearkUserId: clerkUserId },
      });

      if (!existingUser) {
        // Get user details from Clerk
        const clerkUser = await currentUser();
        
        if (clerkUser) {
          // Create user in database
          existingUser = await prisma.user.create({
            data: {
              clearkUserId: clerkUserId,
              name: `${clerkUser.firstName} ${clerkUser.lastName}`,
              email: clerkUser.emailAddresses[0]?.emailAddress || "",
              imageURL: clerkUser.imageUrl || "",
            },
          });
        }
      }
    }

    // Fallback to first user if Clerk auth not available
    if (!existingUser) {
      existingUser = await prisma.user.findFirst();
      
      if (!existingUser) {
        return {
          errors: {
            formErrors: ["No user found. Please ensure you're logged in."],
          },
        };
      }
    }

    await prisma.comment.create({
      data: {
        body: result.data.body,
        userId: existingUser.id,
        articleId: articleId,
      },
    });

    revalidatePath(`/article/${articleId}`);
    return { errors: {} };
  } catch (error: unknown) {
    console.error("Error creating comment:", error);
    return {
      errors: {
        formErrors: ["Failed to create comment. Please try again."],
      },
    };
  }
};
