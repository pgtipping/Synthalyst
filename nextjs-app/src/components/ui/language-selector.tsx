"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/ai/model-router";

interface LanguageSelectorProps {
  modelType: string;
  onLanguageChange: (language: string) => void;
  defaultLanguage?: string;
  className?: string;
}

export function LanguageSelector({
  modelType,
  onLanguageChange,
  defaultLanguage = "English",
  className = "",
}: LanguageSelectorProps) {
  // Get languages supported by the model
  const languages =
    SUPPORTED_LANGUAGES[modelType as keyof typeof SUPPORTED_LANGUAGES] || [];

  // Sort languages alphabetically
  const sortedLanguages = [...languages].sort();

  // State for client-side rendering
  const [mounted, setMounted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Auto Detect");
  const [browserLanguage, setBrowserLanguage] = useState("English");

  // Set mounted state on client side
  useEffect(() => {
    setMounted(true);

    // Detect browser language
    if (typeof window !== "undefined") {
      const browserLang = navigator.language.split("-")[0];

      // Map browser language code to language name
      const languageMap: Record<string, string> = {
        en: "English",
        es: "Spanish",
        fr: "French",
        de: "German",
        zh: "Chinese",
        ja: "Japanese",
        ko: "Korean",
        ru: "Russian",
        pt: "Portuguese",
        it: "Italian",
        ar: "Arabic",
        hi: "Hindi",
        nl: "Dutch",
        tr: "Turkish",
        sv: "Swedish",
        pl: "Polish",
        da: "Danish",
        no: "Norwegian",
        fi: "Finnish",
      };

      const detectedLanguage = languageMap[browserLang] || "English";
      setBrowserLanguage(detectedLanguage);

      // If default language is not explicitly set, use browser language
      if (
        defaultLanguage === "English" &&
        !window.localStorage.getItem("selectedLanguage")
      ) {
        setSelectedLanguage("Auto Detect");
        onLanguageChange(detectedLanguage);
      } else {
        setSelectedLanguage(defaultLanguage);
      }
    }
  }, [defaultLanguage, onLanguageChange]);

  // Handle language change
  const handleLanguageChange = (value: string) => {
    console.log("Language changed to:", value);
    setSelectedLanguage(value);

    // If Auto Detect is selected, use browser language
    if (value === "Auto Detect") {
      onLanguageChange(browserLanguage);
      window.localStorage.removeItem("selectedLanguage");
    } else {
      onLanguageChange(value);
      window.localStorage.setItem("selectedLanguage", value);
    }
  };

  // Don't render the component until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Globe className="h-4 w-4 text-muted-foreground" />
        <div className="w-[180px] h-9 border border-input rounded-md px-3 py-2 text-sm">
          {selectedLanguage}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select
        defaultValue={selectedLanguage}
        value={selectedLanguage}
        onValueChange={handleLanguageChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent
          position="popper"
          sideOffset={4}
          className="z-[100] max-h-[200px] overflow-y-auto"
        >
          <SelectItem key="auto-detect" value="Auto Detect">
            Auto Detect
          </SelectItem>
          {sortedLanguages.map((language) => (
            <SelectItem key={language} value={language}>
              {language}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function LanguageInfo({ modelType }: { modelType: string }) {
  const languages =
    SUPPORTED_LANGUAGES[modelType as keyof typeof SUPPORTED_LANGUAGES] || [];

  return (
    <div className="text-sm text-muted-foreground mt-2">
      <p>
        Supported languages: {languages.slice(0, 3).join(", ")}
        {languages.length > 3 ? ` and ${languages.length - 3} more` : ""}
      </p>
    </div>
  );
}
