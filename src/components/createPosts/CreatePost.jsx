import { useForm } from "react-hook-form";
import AdditionalOptions from "./AdditionalOptions";
import CharacterCount from "./CharacterCount";
import CreatePostHeader from "./CreatePostHeader";
import UserInfo from "./UserInfo";
import { useState } from "react";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function CreatePost({ onClose, postToEdit }) {
  const { api } = useAxios();
  const [previewImage, setPreviewImage] = useState(null);
  const fileUploadRef = useRef();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, reset, watch } = useForm();

  useEffect(() => {
    if (postToEdit) {
      setValue("caption", postToEdit.caption);
      setPreviewImage(
        `${import.meta.env.VITE_STATIC_BASE_URL}/${postToEdit.image}`
      );
    }

    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [postToEdit]);

  const { mutate: updatePostMutation } = useMutation({
    mutationFn: async (data) => {
      const response = await api.patch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/posts/${postToEdit._id}`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Post updated successfully");
      queryClient.invalidateQueries(["createPost"]);
      reset();
      setPreviewImage(null);
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  const { mutate: createPostMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const response = await api.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/posts`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Post created successfully");
      queryClient.invalidateQueries(["allPosts"]);
      reset();
      setPreviewImage(null);
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue("image", file, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const openFileDialog = () => {
    fileUploadRef.current.click();
  };

  const handleCreatePost = (data) => {
    const fromData = new FormData();
    fromData.append("caption", data.caption);

    if (data.image instanceof File) {
      fromData.append("image", data.image);
    }

    if (postToEdit) {
      updatePostMutation(fromData);
    } else {
      createPostMutation(fromData);
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CreatePostHeader
        onCreatePost={handleSubmit(handleCreatePost)}
        onClose={onClose}
      />

      <form
        onSubmit={handleSubmit(handleCreatePost)}
        className="upload-container flex flex-col md:flex-row"
      >
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center relative">
          <img
            src={previewImage ? previewImage : ""}
            alt="Upload preview"
            className="image-preview"
          />

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={openFileDialog}
              type="button"
              className="cursor-pointer bg-black bg-opacity-75 text-white text-sm py-1 px-3 rounded-md"
            >
              Click photo to upload photo
            </button>
            <input
              onChange={handleImageChange}
              type="file"
              id="image"
              name="image"
              accept="image/*"
              ref={fileUploadRef}
              hidden
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-white flex flex-col">
          <UserInfo />

          <div className="p-4 border-b flex-grow">
            <div className="mb-2">
              <p className="font-medium text-base mb-2">Caption Section</p>
              <textarea
                {...register("caption")}
                name="caption"
                id="caption"
                type="text"
                maxLength={500}
                className="w-full caption-input border-0 outline-none text-sm"
                placeholder="Write a caption..."
              />
            </div>
            <CharacterCount caption={watch("caption")} />
          </div>

          <AdditionalOptions />
        </div>
      </form>
    </>
  );
}
