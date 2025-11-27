"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createArticlesSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  category: z
    .string()
    .min(3, "Category must be at least 3 characters")
    .max(50),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

type createArticleFormstate = {
  errors: {
    title?: string[];
    category?: string[];
    featuredImage?: string[];
    content?: string[];
    formErrors?: string[];
  };
};

export const createArticles = async (
  prev: createArticleFormstate,
  formData: FormData
): Promise<createArticleFormstate> => {
  // Validate text fields
  const result = createArticlesSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Handle image upload
  const imageFile = formData.get("featuredImage") as File | null;
  if (!imageFile || imageFile.size === 0) {
    return {
      errors: {
        featuredImage: ["Image file is required"],
      },
    };
  }

  let imageURL: string;

  try {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse: UploadApiResponse | undefined = await new Promise(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "blog-articles" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(buffer);
      }
    );

    if (!uploadResponse?.secure_url) {
      return {
        errors: {
          featuredImage: ["Failed to upload image. Please try again"],
        },
      };
    }

    imageURL = uploadResponse.secure_url;
  } catch (error) {
    console.error("Image upload error:", error);
    return {
      errors: {
        featuredImage: ["Failed to upload image. Please try again"],
      },
    };
  }

  // Create article in database
  try {
    const existingUser = await prisma.user.findFirst();

    if (!existingUser) {
      return {
        errors: {
          formErrors: ["No user found. Please create a user first."],
        },
      };
    }

    await prisma.article.create({
      data: {
        title: result.data.title,
        category: result.data.category,
        content: result.data.content,
        featuredImage: imageURL,
        authorId: existingUser.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error creating article:", error);
    return {
      errors: {
        formErrors: ["Failed to create article. Please try again."],
      },
    };
  }

  redirect("/dashboard");
};
