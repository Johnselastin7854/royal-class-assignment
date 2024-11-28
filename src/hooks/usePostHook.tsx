import { useMutation } from "react-query";
import { toast } from "sonner";

export const usePostData = () => {
  const postOurData = async (fromData: Record<string, string | boolean>) => {
    const response = await fetch(process.env.NEXT_PUBLIC_FETCH_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(fromData),
    });

    if (!response.ok) {
      throw new Error("Failed to create data");
    }

    return response.json();
  };

  const { mutate: SubmitForm, isSuccess, error } = useMutation(postOurData);

  if (isSuccess) {
    toast.success("data added  successfully!");
  }

  if (error instanceof Error) {
    toast.error(error.message);
  }

  return { SubmitForm };
};
