import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useFetchData = () => {
  const getFormFields = async () => {
    const response = await fetch(process.env.FETCH_URL!);

    if (!response.ok) {
      throw new Error("Error fetching restaurant");
    }
    const data = await response.json();

    return [
      {
        label: data.title,
        name: "username",
        placeholder: "Enter your username",
        required: true,
        type: "text",
        variant: "Input",
      },
      {
        label: data.body,
        name: "agree",
        required: true,
        type: "checkbox",
        variant: "Checkbox",
      },
    ];
  };

  const {
    data: formFieldData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["formFields"],
    queryFn: getFormFields,
  });

  if (error) {
    toast.error(error.toString());
  }

  return {
    formFieldData,
    isLoading,
    error,
  };
};
