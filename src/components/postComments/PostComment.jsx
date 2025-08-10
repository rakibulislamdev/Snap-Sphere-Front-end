import { useForm } from "react-hook-form";
import { SendIcon } from "../../utils/svg";
import useAxios from "../../hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Field from "../common/Field";
import { toast } from "react-toastify";

export default function PostComment({ post }) {
  console.log(post);
  const { api } = useAxios();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm();

  const { mutate: submitComment, isLoading } = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/posts/${post._id}/comment`,
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comment", post._id]);
      toast.success("Comment posted successfully");
      reset();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleComment = (formData) => {
    if (!formData.comment?.trim()) {
      return;
    }

    submitComment({ text: formData.comment });
  };

  return (
    <>
      <div className="px-3 mt-1">
        <Link to={`/posts/${post._id}`}>
          <button className="text-gray-500 text-sm cursor-pointer">
            View all {post?.comments?.length} comments
          </button>
        </Link>
      </div>

      <form
        onSubmit={handleSubmit(handleComment)}
        className="px-3 mt-2 flex justify-between items-center"
      >
        <Field>
          <input
            {...register("comment")}
            id="comment"
            name="comment"
            type="text"
            placeholder="Add a comment..."
            className="text-sm w-full outline-none"
          />
        </Field>

        <button disabled={isLoading} type="submit" className="cursor-pointer">
          <SendIcon />
        </button>
      </form>
    </>
  );
}
