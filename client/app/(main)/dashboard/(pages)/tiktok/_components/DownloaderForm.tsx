"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDownloader } from "@/hooks/tiktok/useDownloader";

const formSchema = z.object({
  url: z.string().url({
    message: "Must be a url.",
  }),
});

export function DownloaderForm() {
  const { Download, GetFile } = useDownloader();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await Download(values.url); // Downloads Video and returns result

    // Ensure result contains the file_path
    if (!result || !result.file_path) {
        throw new Error("Video Could not be downloaded or file_path is missing");
    }

    // Pass the file_path to GetFile
    await GetFile(result.file_path);  // Use file_path directly
}


  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full ">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url</FormLabel>
              <FormControl>
                <Input placeholder="https://tiktok.com/video" {...field} />
              </FormControl>
              <FormDescription>
                This is the video we will download
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
