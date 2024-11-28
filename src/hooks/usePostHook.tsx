import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePostData = () => {
  const postOurData = async (fromData: Record<string, string | boolean>) => {
    const response = await fetch(process.env.SUBMIT_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(fromData),
    });

    if (!response.ok) {
      throw new Error("Failed to create restaurant");
    }

    return response.json();
  };

  const {
    mutate: createRestaurant,
    isSuccess,
    error,
  } = useMutation(postOurData);

  if (isSuccess) {
    toast.success("Restaurant created!");
  }

  if (error) {
    toast.error("Unable to update restaurant");
  }

  return { createRestaurant };
};
