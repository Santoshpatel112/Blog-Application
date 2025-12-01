import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, MessageCircle } from "lucide-react";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import CommentForm from "@/components/comments/comment-input";
import CommentList from "@/components/comments/comments-list";

type ArticleDetailPageProps = {
  article: Prisma.ArticleGetPayload<{
    include: {
      author: {
        select: {
          name: true;
          email: true;
          imageURL: true;
        };
      };
    };
  }>;
};

export async function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  // Fetch comments for this article
  const comments = await prisma.comment.findMany({
    where: {
      articleId: article.id,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          imageURL: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-4xl">
          {/* Featured Image */}
          <div className="relative w-full h-96 mb-8 rounded-2xl overflow-hidden">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {article.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              {article.title}
            </h1>

            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={article.author.imageURL || ""} />
                  <AvatarFallback>
                    {article.author.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {article.author.name}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.createAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      5 min read
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <Card className="p-8 mb-8">
            <section
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </Card>

          {/* Comments Section */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <MessageCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">
                {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
              </h2>
            </div>

            {/* Comment Form */}
            <CommentForm articleId={article.id} />

            {/* Comments List */}
            <CommentList comments={comments} />
          </Card>
        </article>
      </main>
    </div>
  );
}
