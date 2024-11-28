"use client";
import React, { useState } from "react";
import formData from "@/data/formData.json";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";

const DynamicForm = () => {
  const [formStae, setFormStae] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (name: string, value: string | boolean) => {
    console.log(name, value);
    setFormStae((prev) => ({
      ...prev,
      [name]: value,
    }));

    setCheckboxValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log(checkboxValues);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      // Handle form submission
      console.log("Form submitted successfully!");
    } else {
      setErrors(errors);
    }
  };
  return (
    <div className="flex items-center justify-center  min-h-screen">
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
                    required={field.required}
                    disabled={field.disabled}
                    defaultValue={field.value}
                    className="w-[200px]"
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                  {field.description && (
                    <p className="text-xs">{field.description}</p>
                  )}
                </div>
              );
            case "Checkbox":
              return (
                <div key={index} className="space-x-2 ">
                  <Checkbox
                    id={field.name}
                    checked={checkboxValues[field.name]}
                    disabled={field.disabled}
                    required={field.required}
                    onCheckedChange={(checked) =>
                      handleChange(field.name, checked)
                    }
                  />
                  <label htmlFor={field.name}>{field.label}</label>
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
