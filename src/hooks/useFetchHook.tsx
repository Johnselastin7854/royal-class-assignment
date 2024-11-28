import { useQuery } from "react-query";
import { toast } from "sonner";

export const useFetchData = () => {
  const getFormFields = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_FETCH_URL!);

    if (!response.ok) {
      throw new Error("Error fetching data");
    }
    const data = await response.json();

    return [
      {
        checked: true,
        description: "This is your public display name.",
        disabled: false,
        label: data.title,
        name: "username",
        placeholder: "shadcn",
        required: true,
        rowIndex: 0,
        type: "text",
        value: "",
        variant: "Input",
      },
      {
        label: "Age",
        name: "age",
        placeholder: "Enter your age",
        required: true,
        rowIndex: 1,
        type: "number",
        value: "",
        variant: "Input",
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
