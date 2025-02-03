"use client";

import { useEffect, useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";

interface FileUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const FileUpload = ({ value, onChange, disabled }: FileUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-4 w-full flex flex-col justify-center items-senter">
      <CldUploadButton
        onSuccess={(result: any) => onChange(result.info.secure_url)}
        options={{
          maxFiles: 1,
        }}
        uploadPreset="snwrt44t"
      >
        <div
          className="
                p-4
                border-4border-dashed
                border-primary/10
                rounded-lg
                hover:opacity-75
                transition
                flex
                flex-colspace-y-2
                items-center
                justify-center
            "
        >
          <div className="relative h-40 w-40">
            <Image
              fill
              alt="uUpload"
              src={value || "/placeholder.svg"}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </CldUploadButton>
    </div>
  );
};
