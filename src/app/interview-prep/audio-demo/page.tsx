"use client";

import { useState } from "react";
import {
  AudioRecorder,
  SpeechRecognitionDisplay,
  TextToSpeechPlayer,
  AudioAnalysisDisplay,
} from "@/components/interview-prep";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
