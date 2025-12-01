import EditArticlePage from "@/components/articles/edit-article-page";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Get the current user
  const currentUser = await prisma.user.findUnique({
    where: {
      clearkUserId: userId,
    },
  });

  if (!currentUser) {
    redirect("/");
  }

  const article = await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      category: true,
      content: true,
      featuredImage: true,
      authorId: true,
    },
  });

  if (!article) {
    notFound();
  }

  // Check if the user is the author of the article
  if (article.authorId !== currentUser.id) {
    redirect("/dashboard");
  }

  return <EditArticlePage article={article} />;
};

export default Page;
