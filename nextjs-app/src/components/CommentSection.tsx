"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { toast } from "sonner";

// Mock comment type
interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  postId: string;
}

interface CommentSectionProps {
  postId: string;
  initialComments?: Comment[];
}

export default function CommentSection({
  postId,
  initialComments = [],
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In a real app, this would be determined by authentication state
  const isLoggedIn = false;
  const currentUser = {
    name: "Guest User",
    avatar: undefined,
  };

  // Load comments for this specific post
  useEffect(() => {
    // In a real app, this would fetch comments from an API
    // Example: fetchComments(postId).then(data => setComments(data));

    // For now, we'll just filter the initial comments by postId
    const filteredComments = initialComments.filter(
      (comment) => comment.postId === postId
    );
    setComments(filteredComments);
  }, [postId, initialComments]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (!isLoggedIn) {
      toast.error("You must be logged in to comment");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      // await fetch('/api/comments', {
      //   method: 'POST',
      //   body: JSON.stringify({ postId, content: newComment }),
      // });

      // Mock successful comment submission
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        author: currentUser,
        content: newComment,
        createdAt: new Date(),
        postId: postId, // Use the postId parameter
      };

      setComments([...comments, newCommentObj]);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date to readable string
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>

      {/* Comment form */}
      <div className="space-y-4">
        <Textarea
          placeholder={
            isLoggedIn ? "Add a comment..." : "Please log in to comment"
          }
          value={newComment}
          onChange={handleCommentChange}
          disabled={!isLoggedIn || isSubmitting}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitComment}
            disabled={!isLoggedIn || isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? "Submitting..." : "Post Comment"}
          </Button>
        </div>
        {!isLoggedIn && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You need to be logged in to comment.{" "}
            <a
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Log in
            </a>{" "}
            or{" "}
            <a
              href="/register"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              register
            </a>
            .
          </p>
        )}
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback>
                      {comment.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{comment.author.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{comment.content}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex space-x-2 text-sm">
                  <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    Reply
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    Like
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
