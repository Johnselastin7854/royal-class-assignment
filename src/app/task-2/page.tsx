"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Contact, Loader2, MoveRight, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/useFetchHook";
import { usePostData } from "@/hooks/usePostHook";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interactions, setInteractions] = useState(0);

  useEffect(() => {
    if (formFieldData) {
      const initialFormState: Record<string, string | boolean> = {};
      formFieldData.forEach((field) => {
        initialFormState[field.name] = field.value || "";
      });
      setFormStae(initialFormState);
    }
  }, [formFieldData]);

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

    setInteractions((prev) => prev + 1);
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
      setIsSubmitting(true);

      try {
        toast("Submitting....");
        SubmitForm(formStae);
        toast("Form submitted successfully!");
        setFormStae({});
        setCheckboxValues({});
        setErrors({});
      } catch (e) {
        toast.error("Failed to submit form.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("All fields are required");

      setErrors(errors);
    }
  };

  const handleReset = () => {
    setFormStae({});
    setCheckboxValues({});
    setErrors({});
    setInteractions(0);
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

        {formStae["age"] && Number(formStae["age"]) > 18 && (
          <div className="space-x-2">
            <label htmlFor="contactMethod">Contact Method</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Options <Contact />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>Email</DropdownMenuItem>

                <DropdownMenuItem>Phone</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>

        <Button type="button" className="w-full mt-2" onClick={handleReset}>
          Reset Form
        </Button>
      </form>

      <p>Form Interactions: {interactions}</p>

      <Link href={"/"} className="flex gap-5">
        Go To Home <MoveRight />{" "}
      </Link>
    </div>
  );
};

export default Task2;
