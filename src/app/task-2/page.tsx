"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, MoveRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/useFetchHook";
import { usePostData } from "@/hooks/usePostHook";

const Task2 = () => {
  const { formFieldData, isLoading, error } = useFetchData();
  const { SubmitForm } = usePostData();
  const [formStae, setFormStae] = useState<Record<string, string | boolean>>(
    {}
  );
  const [checkboxValues, setCheckboxValues] = useState<Record<string, boolean>>(
    {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string | boolean) => {
    setFormStae((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (typeof value === "boolean") {
      setCheckboxValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    formFieldData?.forEach((field) => {
      if (
        field.required &&
        !formStae[field.name] &&
        !checkboxValues[field.name]
      ) {
        errors[field.name] = `${field.label} is required.`;
      }
    });
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      SubmitForm(formStae);
      toast("Form submitted successfully!");
      setFormStae({});
      setCheckboxValues({});
      setErrors({});
    } else {
      toast.error("All fields are required");

      setErrors(errors);
    }
  };

  if (isLoading)
    return (
      <p className="flex items-center justify-center min-h-screen text-lg gap-3">
        Loading... <Loader2 className="animate-spin" />
      </p>
    );
  if (error) return <p>Error fetching form data.</p>;
  return (
    <div className="flex items-center justify-center min-h-screen flex-col gap-10">
      <form
        className="space-y-5 border border-gray-300 rounded-sm p-10 max-w-[500px]"
        onSubmit={handleSubmit}
      >
        {formFieldData?.map((field, index) => {
          switch (field.variant) {
            case "Input":
              return (
                <div key={index} className="space-y-1">
                  <label htmlFor={field.name}>{field.label}</label>
                  <Input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    value={String(formStae[field.name]) || ""}
                    className="w-[200px]"
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                  {field.description && (
                    <p className="text-xs">{field.description}</p>
                  )}
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs">{errors[field.name]}</p>
                  )}
                </div>
              );
            case "Checkbox":
              return (
                <div key={index} className="space-x-2">
                  <Checkbox
                    id={field.name}
                    checked={checkboxValues[field.name] ?? field.checked}
                    disabled={field.disabled}
                    onCheckedChange={(checked) =>
                      handleChange(field.name, checked)
                    }
                  />
                  <label htmlFor={field.name}>{field.label}</label>
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs">{errors[field.name]}</p>
                  )}
                </div>
              );
            default:
              return null;
          }
        })}
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>

      <Link href={"/task-2"} className="flex gap-5">
        Go To Task 3 <MoveRight />{" "}
      </Link>
    </div>
  );
};

export default Task2;
