import usePostsConnection from "../hooks/usePostsConnection";

const PostsConnection = ({ courseId }: { courseId: number }) => {
  usePostsConnection(courseId);
  return null;
};

export default PostsConnection;
