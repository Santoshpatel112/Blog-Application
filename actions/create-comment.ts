"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
    // For now, use the first user as the commenter
    const existingUser = await prisma.user.findFirst();

    if (!existingUser) {
      return {
        errors: {
          formErrors: ["No user found. Please create a user first."],
        },
      };
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
