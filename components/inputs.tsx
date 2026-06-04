"use client";
import { useState } from "react";
import { NextPage } from "next";
import {
  EyeIcon,
  EyeSlashIcon,
  QuestionIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { InputProps, SelectProps, TextAreaProps } from "@/@types";

export const Input: NextPage<InputProps> = ({
  size = "md",
  inputType = "default",
  destructive = false,
  label,
  hintText,
  helpIcon,
  icon,
  dropdownOptions,
  leadingText,
  trailingButton,
  name,
  value,
  onChange,
  register,
  disabled,
  className,
  placeholder,
  type,
  ...rest
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const sizeClasses: { [K in InputProps["size"] as string]?: string } = {
    sm: "py-2 px-3 text-Text-sm h-10",
    md: "py-2 px-4 text-base",
  };

  const classNames = `inline-flex gap-2 items-center relative bg-grey-50  rounded-lg shadow  ${
    sizeClasses[size]
  } ${destructive ? "border-error-600" : "border-grey-300"} ${
    // Add this line
    disabled ? "bg-grey-50 cursor-not-allowed" : "bg-grey-0"
  } ${className}`;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && inputValue !== "") {
      event.preventDefault();
      setTags((prevTags) => [...prevTags, inputValue]);
      setInputValue("");
    }
  };

  return (
    <>
      <div className="inline-flex flex-col w-full">
        {label && (
          <label className="mb-1.5 text-grey-800 text-sm font-bold">
            {label}
          </label>
        )}
        <div className={classNames}>
          {inputType === "iconLeading" && icon && <span>{icon}</span>}
          {inputType === "leadingDropdown" && dropdownOptions && (
            <select>
              {dropdownOptions.map(
                (option: { label: string; value: string }, index: number) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ),
              )}
            </select>
          )}

          {inputType === "leadingText" && leadingText && (
            <span className="">{leadingText}</span>
          )}

          <input
            {...(register ? register(name) : { value, onChange })}
            {...(onChange && { onChange })}
            {...(value && { value })}
            className={`w-full`}
            disabled={disabled}
            type={type === "password" && isPasswordVisible ? "text" : type}
            onKeyDown={inputType === "tags" ? handleKeyDown : undefined}
            placeholder={placeholder}
            {...rest}
          />

          {inputType === "tags" && tags.length > 0 && (
            <div className="flex flex-wrap mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 mr-1 bg-gray-200 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {type === "password" && (
            <span
              className="absolute inset-y-3 cursor-pointer right-0 pr-3"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <EyeIcon color="#98A2B3" size={16} />
              ) : (
                <EyeSlashIcon color="#98A2B3" size={16} />
              )}
            </span>
          )}
          {helpIcon &&
            type !== "password" &&
            (destructive ? <WarningCircleIcon /> : <QuestionIcon />)}
          {inputType === "trailingButton" && trailingButton && (
            <span>{trailingButton}</span>
          )}
          {inputType === "trailingDropdown" && dropdownOptions && (
            <select>
              {dropdownOptions.map((option, index: number) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
        {hintText && (
          <p
            className={`mt-1.5 text-Text-sm self-stretch ${
              destructive ? "text-error-600" : "text-grey-600"
            }`}
          >
            {hintText}
          </p>
        )}
      </div>

      <style jsx>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        textarea:-webkit-autofill:active {
          -webkit-background-clip: text;
          -webkit-text-fill-color: #101828;
          transition: background-color 5000s ease-in-out 0s;
          box-shadow: inset 0 0 20px 20px transparent;
        }

        input,
        select,
        textarea {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          outline: 0;
          background-color: transparent;
          font-size: 1rem;
          line-height: 1.5;
          color: #101828;
          transition:
            border-color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: 0;
          background-color: transparent;
          color: #101828;
        }

        input:disabled,
        select:disabled,
        textarea:disabled {
          background-color: transparent;
          opacity: 1;
          color: #667085;
        }
      `}</style>
    </>
  );
};

export const TextArea: NextPage<TextAreaProps> = ({
  size = "sm",
  inputType = "default",
  label,
  hintText,
  helpIcon,
  icon,
  name,
  value,
  onChange,
  register,
  disabled,
  className,
  placeholder,
  destructive,
  ...rest
}) => {
  const sizeClasses: { [K in TextAreaProps["size"] as string]?: string } = {
    sm: "py-2 px-3 text-Text-sm h-20",
    md: "py-2 px-4 text-base h-32",
  };

  const classNames = `inline-flex gap-2 items-center relative  rounded-lg shadow border  ${
    sizeClasses[size]
  } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"} ${className}`;

  return (
    <>
      <div className="inline-flex flex-col w-full">
        {label && (
          <label className="mb-1.5 text-grey-800 text-sm font-bold">
            {label}
          </label>
        )}
        <div className={classNames}>
          {inputType === "iconLeading" && icon && <span>{icon}</span>}
          <textarea
            {...(register ? register(name) : { value, onChange })}
            {...(onChange && { onChange })}
            {...(value && { value })}
            className={`w-full resize-none h-full ${
              inputType === "iconLeading" && icon ? "pl-10" : ""
            }`}
            disabled={disabled}
            name={name}
            placeholder={placeholder}
            {...rest}
          />
          {helpIcon && (destructive ? <WarningCircleIcon /> : <QuestionIcon />)}
        </div>
        {hintText && (
          <p
            className={`mt-1.5 text-Text-sm self-stretch ${
              disabled ? "text-gray-600" : "text-gray-600"
            }`}
          >
            {hintText}
          </p>
        )}
      </div>
      <style jsx>{`
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        textarea:-webkit-autofill:active {
          -webkit-background-clip: text;
          -webkit-text-fill-color: #101828;
          transition: background-color 5000s ease-in-out 0s;
          box-shadow: inset 0 0 20px 20px transparent;
        }

        textarea {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          outline: 0;
          background-color: transparent;
          font-size: 1rem;
          line-height: 1.5;
          color: #101828;
          transition:
            border-#101828 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
        }

        textarea:focus {
          outline: 0;
          background-color: transparent;
          color: #101828;
        }

        textarea:disabled {
          background-color: transparent;
          opacity: 1;
          color: #667085;
        }
      `}</style>
    </>
  );
};

export const Select: NextPage<SelectProps> = ({
  size = "md",
  label,
  hintText,
  helpIcon,
  icon,
  name,
  value,
  onChange,
  register,
  disabled,
  className,
  placeholder,
  options,
  destructive = false,
  ...rest
}) => {
  const sizeClasses: { [K in SelectProps["size"] as string]?: string } = {
    sm: "py-2 px-3 text-Text-sm h-10",
    md: "py-2 px-4 text-base",
  };

  const classNames = `inline-flex gap-2 items-center relative  rounded-lg shadow bg-grey-500 border  ${
    sizeClasses[size]
  } ${disabled ? "bg-grey-100 cursor-not-allowed" : "bg-white"} ${className}`;

  return (
    <>
      <div className="inline-flex flex-col w-full">
        {label && (
          <label className="mb-1.5 text-grey-800 text-sm font-bold">
            {label}
          </label>
        )}
        <div className={classNames}>
          {icon && <span>{icon}</span>}
          <select
            {...(register ? register(name) : { value, onChange })}
            {...(onChange && { onChange })}
            {...(value && { value })}
            className={`w-full`}
            disabled={disabled}
            name={name}
            placeholder={placeholder}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {helpIcon && (destructive ? <WarningCircleIcon /> : <QuestionIcon />)}
        </div>
        {hintText && (
          <p
            className={`mt-1.5 text-Text-sm self-stretch ${
              destructive ? "text-error-600" : "text-grey-600"
            }`}
          >
            {hintText}
          </p>
        )}
      </div>
      <style jsx>{`
        select:-webkit-autofill,
        select:-webkit-autofill:hover,
        select:-webkit-autofill:focus,
        select:-webkit-autofill:active {
          -webkit-background-clip: text;
          -webkit-text-fill-color: #101828;
          transition: background-color 5000s ease-in-out 0s;
          box-shadow: inset 0 0 20px 20px transparent;
        }

        select {
          outline: 0;
          background-color: transparent;
          font-size: 1rem;
          line-height: 1.5;
          color: #101828;
          transition:
            border-#101828 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
        }

        select:focus {
          outline: 0;
          background-color: transparent;
          color: #101828;
        }

        select:disabled {
          background-color: transparent;
          opacity: 1;
          color: #667085;
        }

        select option {
          padding: 12px 16px;
          background-color: #ffffff;
          color: #475467;
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
          transition: background-color 0.15s ease-in-out;
        }

        select option:hover {
          background-color: #f9fafb;
        }

        select option:checked {
          background-color: #f9fafb;
          color: #101828;
          font-weight: 500;
        }

        select option:disabled {
          color: #d0d5dd;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};
