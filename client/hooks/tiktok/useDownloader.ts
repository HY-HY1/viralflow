import { useState } from "react";
import axios from "axios";
import { TiktokDownloadResponse } from "@/types/hooks/Response";

export function useDownloader() {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    console.log("ServerURL", SERVER_URL)

    // Ensure SERVER_URL is defined
    if (!SERVER_URL) {
        throw new Error("SERVER_URL is not defined in the environment variables.");
    }

    const Download = async (url: string) => {
        try {
            const response: TiktokDownloadResponse = await axios.post(
                `${SERVER_URL}/api/download/tiktok`,
                { url },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
    
            console.log("Backend Response Data:", response.data); // Log the entire response data to inspect it
    
            // Check if the response is successful and contains file_path
            if (response.status === 200 && response.data && response.data.file_path) {
                return response.data;  // Return the data directly
            } else {
                throw new Error("Failed to download or file_path is missing");
            }
        } catch (error) {
            console.error("Download error:", error);
            return { file_path: null, error: error instanceof Error ? error.message : "Unknown error" };
        }
    };
    
    

    // Get file function: Trigger download without returning data
    const GetFile = async (filePath: string) => {
        console.log("File Path in GetFile:", filePath); // Log filePath to ensure it's correct
        try {
            if (!filePath) {
                throw new Error("filePath is missing");
            }
    
            const response = await axios.get(`${SERVER_URL}/api/download/file/${filePath}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                responseType: 'blob',
            });
    
            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filePath); // Use the filename from filePath
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
    
                return { data: null, error: null };
            } else {
                throw new Error('Failed to fetch file');
            }
        } catch (error) {
            console.error("GetFile error:", error);
            return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
        }
    };
    

    return { Download, GetFile };
}
