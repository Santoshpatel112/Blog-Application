import { ArticleDetailPage } from "@/components/articles/article-detail-page";
import { prisma } from "@/lib/prisma";
import React from "react";
import { auth } from "@clerk/nextjs/server";

type ArticleDetailPageProps = {
  params: Promise<{ id: string }>;
};

const page: React.FC<ArticleDetailPageProps> = async ({ params }) => {
  const id = (await params).id;
  const { userId } = await auth();
  
  const article = await prisma.article.findUnique({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
          imageURL: true,
        },
      },
    },
  });
  
  if (!article) {
    return <h1>Article not found.</h1>;
  }

  // Fetch likes for this article
  const likes = await prisma.like.findMany({
    where: {
      articleId: id,
    },
  });

  // Check if current user has liked this article
  let isLiked = false;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: {
        clearkUserId: userId,
      },
    });
    
    if (user) {
      isLiked = likes.some((like) => like.userId === user.id);
    }
  }

  return (
    <div>
      <ArticleDetailPage article={article} likes={likes} isLiked={isLiked} />
    </div>
  );
};

export default page;