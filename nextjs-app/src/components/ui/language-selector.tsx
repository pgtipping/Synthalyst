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
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>(defaultLanguage);
  const [browserLanguage, setBrowserLanguage] = useState<string>("English");

  // Get languages supported by the model
  const languages =
    SUPPORTED_LANGUAGES[modelType as keyof typeof SUPPORTED_LANGUAGES] || [];

  // Detect browser language on component mount
  useEffect(() => {
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

      // Only set if the detected language is supported by the model
      if (languages.includes(detectedLanguage)) {
        setBrowserLanguage(detectedLanguage);
        setSelectedLanguage(detectedLanguage);
        onLanguageChange(detectedLanguage);
      }
    }
  }, [languages, onLanguageChange]);

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    onLanguageChange(value);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language} value={language}>
              {language} {language === browserLanguage && "(Browser Default)"}
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
