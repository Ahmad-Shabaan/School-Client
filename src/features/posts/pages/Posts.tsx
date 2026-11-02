import { useParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { handleErrorMessage } from "@/lib/utils/handleErrorMessage";
import AppError from "@/shared/components/common/ErrorBoundary/AppError";
import { studentCoursePath } from "@/config/routes";
import PostCard from "../components/PostCard";
import PostComposer from "../components/PostComposer";
import PostSkeleton from "../components/PostSkeleton";
import { useCreatePost, usePostsFeed } from "../hooks/usePosts";
import { flattenPosts } from "../utils/postCache";

const Posts = () => {
  const { courseId: courseIdParam } = useParams();
  const courseId = Number(courseIdParam);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePostsFeed(courseId);
  const createPost = useCreatePost();

  const posts = flattenPosts(data);
  const totalPosts = data?.pages[0]?.pagination?.totalCount ?? posts.length;
  const coursePath = studentCoursePath(courseId);

  return (
    <section aria-labelledby="posts-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2
            id="posts-heading"
            className="text-lg font-extrabold text-ink sm:text-xl"
          >
            منشورات المقرر
          </h2>
          <p className="mt-1 text-sm text-body-mute">
            شارك أفكارك وتواصل مع زملائك في هذا المقرر.
          </p>
        </div>

        {totalPosts > 0 && (
          <span className="rounded-full bg-teal-soft px-3 py-1 text-xs font-extrabold text-teal-dark">
            {totalPosts} منشور
          </span>
        )}
      </div>

      <div className="mb-6">
        <PostComposer
          onSubmit={(content) =>
            createPost.mutateAsync({ courseId, content })
          }
          isSubmitting={createPost.isPending}
        />
      </div>

      {isLoading ? (
        <PostSkeleton count={3} />
      ) : isError ? (
        <AppError
          message={handleErrorMessage(error).title}
          link="العودة إلى المقرر"
          to={coursePath}
          onRetry={() => {
            void refetch();
          }}
        />
      ) : posts.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-line bg-white px-6 py-14 text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl border border-line bg-teal-soft text-teal-dark">
            <MessageCircle className="size-6" />
          </div>
          <h2 className="text-lg font-extrabold text-ink">
            لا توجد منشورات في هذا المقرر بعد
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-body-mute">
            ابدأ النقاش بمشاركة فكرة أو سؤال، وسيظهر منشورك هنا فوراً.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="mt-7 flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void fetchNextPage();
            }}
            disabled={isFetchingNextPage}
            className="border-line bg-white px-6 text-teal-dark hover:border-gold hover:bg-paper"
          >
            {isFetchingNextPage && <Spinner className="size-4" />}
            عرض المزيد
          </Button>
        </div>
      )}
    </section>
  );
};

export default Posts;
