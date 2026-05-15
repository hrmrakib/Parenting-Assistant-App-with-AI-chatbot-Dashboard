/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useGetAboutQuery,
  useSetAboutMutation,
} from "@/redux/features/settings/settingsAPI";
import Spinner from "@/components/loading/Spinner";

export default function EditAbout() {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [content, setContent] = useState<string>("");
  const router = useRouter();

  const { data: termsData, isLoading } = useGetAboutQuery({});
  const terms = termsData?.data;

  const [setPrivacyPolicyMutation, { isLoading: isSaving }] =
    useSetAboutMutation();

  useEffect(() => {
    let initialized = false;

    const init = async () => {
      if (initialized || quillRef.current) return;
      initialized = true;

      const Quill = (await import("quill")).default;

      if (editorRef.current && !editorRef.current.querySelector(".ql-editor")) {
        const quill = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: "Enter your about...",
        });

        quillRef.current = quill;

        if (terms[0]?.description) {
          quill.root.innerHTML = terms[0].description;
          setContent(terms[0].description);
        }

        quill.on("text-change", () => {
          setContent(quill.root.innerHTML);
        });
      }
    };

    if (typeof window !== "undefined") {
      init();
    }

    return () => {
      initialized = true;
    };
  }, [terms]);

  if (isLoading && !terms && !quillRef.current) return <Spinner />;

  const handleSubmit = async () => {
    if (!content || content === "<p><br></p>") {
      toast.error("Description cannot be empty");
      return;
    }

    try {
      const res = await setPrivacyPolicyMutation({
        description: content,
      }).unwrap();

      if (res) {
        toast.success("About updated successfully!");
        router.push("/setting/about");
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to update Terms and Conditions",
      );
    }
  };

  return (
    <div className='min-h-[75vh] w-[96%] mx-auto flex flex-col justify-between gap-6'>
      <div className='space-y-6'>
        <div className='h-auto'>
          <div
            ref={editorRef}
            className='h-[50vh] bg-white text-base text-primary'
            id='quill-editor'
          />
        </div>
      </div>

      <div className='flex justify-end'>
        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className='bg-primary hover:bg-teal-700'
        >
          {isSaving ? "Saving..." : "Save Content"}
        </Button>
      </div>
    </div>
  );
}
