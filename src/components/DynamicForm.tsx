"use client";
import React, { useState } from "react";
import formData from "@/data/formData.json";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { toast } from "sonner";

const DynamicForm = () => {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    formData.forEach((field) => {
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
      toast("Form submitted successfully!");
      setFormStae({});
      setCheckboxValues({});
      setErrors({});
    } else {
      toast.error("All fields are required");

      setErrors(errors);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        className="space-y-5 border border-gray-300 rounded-sm p-10"
        onSubmit={handleSubmit}
      >
        {formData?.map((field, index) => {
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
    </div>
  );
};

export default DynamicForm;
