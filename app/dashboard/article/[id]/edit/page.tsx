import EditArticlePage from "@/components/articles/edit-article-page";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      category: true,
      content: true,
      featuredImage: true,
    },
  });

  if (!article) {
    notFound();
  }

  return <EditArticlePage article={article} />;
};

export default Page;
