"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, Share2, ThumbsUp, Check } from "lucide-react";
import React, { useOptimistic, useTransition, useState } from "react";
import { LikeDislike } from "@/actions/like-dislike";
import { saveArticle } from "@/actions/save-article";
import type { Like } from "@prisma/client";

// @ts-ignore - SavedArticle will be available after Prisma generation
type SavedArticle = any;
import { useToast } from "@/hooks/use-toast";

type LikeButtonProps = {
  articleId: string;
  likes: Like[];
  isLiked: boolean;
  savedArticles: SavedArticle[];
  isSaved: boolean;
};

const LikeButton: React.FC<LikeButtonProps> = ({
  articleId,
  likes,
  isLiked,
  savedArticles,
  isSaved,
}) => {
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(likes.length);
  const [optimisticSaved, setOptimisticSaved] = useOptimistic(isSaved);
  const [isPendingLike, startLikeTransition] = useTransition();
  const [isPendingSave, startSaveTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    startLikeTransition(async () => {
      setOptimisticLikes(isLiked ? optimisticLikes - 1 : optimisticLikes + 1);
      await LikeDislike(articleId);
    });
  };

  const handleSave = async () => {
    startSaveTransition(async () => {
      setOptimisticSaved(!optimisticSaved);
      await saveArticle(articleId);
      toast({
        title: optimisticSaved ? "Article unsaved" : "Article saved",
        description: optimisticSaved 
          ? "Article removed from your saved list" 
          : "Article saved to your dashboard",
      });
    });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/article/${articleId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Article link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-4 border-y py-6">
      <Button
        type="button"
        variant={isLiked ? "default" : "ghost"}
        className="gap-2"
        onClick={handleLike}
        disabled={isPendingLike}
      >
        <ThumbsUp className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
        {optimisticLikes}
      </Button>
      
      <Button 
        variant={optimisticSaved ? "default" : "ghost"} 
        className="gap-2"
        onClick={handleSave}
        disabled={isPendingSave}
      >
        <Bookmark className={`h-5 w-5 ${optimisticSaved ? "fill-current" : ""}`} />
        {optimisticSaved ? "Saved" : "Save"}
      </Button>
      
      <Button 
        variant="ghost" 
        className="gap-2"
        onClick={handleShare}
      >
        {copied ? (
          <>
            <Check className="h-5 w-5" /> Copied
          </>
        ) : (
          <>
            <Share2 className="h-5 w-5" /> Share
          </>
        )}
      </Button>
    </div>
  );
};

export default LikeButton;