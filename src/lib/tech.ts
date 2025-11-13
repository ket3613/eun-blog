import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export type TechPost = {
  id: string;
  title: string;
  category: string; // ex) Java, Spring, AWS 등
  tags: string[];
  content: string; // Markdown or plain text
  images: string[]; // public 경로 (/uploads/xxx.png)
  createdAt: string;
  updatedAt: string;
};

