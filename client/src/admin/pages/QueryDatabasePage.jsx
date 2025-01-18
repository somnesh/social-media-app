import { useState, Suspense, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { CircleX, Loader2 } from "lucide-react";
import { useToastHandler } from "@/contexts/ToastContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function QueryDatabasePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [collection, setCollection] = useState("");
  const [collections, setCollections] = useState([]);
  const [responseData, setResponseData] = useState([]);

  const toastHandler = useToastHandler();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Prompt:", prompt);
    console.log("Collection:", collection);

    if (!prompt || !collection) {
      return;
    }

    try {
      setIsLoading(true);
      const result = await axios.get(
        `${API_URL}/admin/generate-query-from-gemini`,
        {
          params: { userQuery: prompt, collection: collection },
          withCredentials: true,
        }
      );

      setResponseData(result.data);
      console.log(result.data);
    } catch (error) {
      console.error(error);
      let msg = "";
      if (error.response) {
        msg = error.response.data.msg;
      }
      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleX className="bg-[#ef4444] rounded-full text-white dark:text-[#7f1d1d]" />
          <span>{msg || "Something went wrong"}</span>
        </div>,
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getCollectionList = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/get-collection-list`, {
        withCredentials: true,
      });
      const convertedItems = response.data.collections.map(
        (item) =>
          item
            .replace(/ies$/, "y") // Replace 'ies' with 'y'
            .replace(/s$/, "") // Remove trailing 's' for general case
            .replace(/^./, (char) => char.toUpperCase()) // Capitalize the first letter
      );
      setCollections(convertedItems);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCollectionList();
  }, []);

  return (
    <div>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-semibold">Query Database</h1>
        <Card className="w-full dark:bg-black rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <img src="/icons/gemini.svg" alt="" />
              <span>Query the database using Natural Language</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="prompt" className="text-sm font-medium">
                  Enter your query prompt
                </label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., Show me the user with user id 67358705186fff15c538bf1d"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  required
                />
                <span className="text-xs text-gray-500">
                  Gemini can make mistakes, prompt carefully.
                </span>
              </div>
              <div className="space-y-2">
                <label htmlFor="collection" className="text-sm font-medium">
                  Select collection
                </label>
                <Select
                  value={collection}
                  onValueChange={setCollection}
                  required={true}
                >
                  <SelectTrigger id="collection">
                    <SelectValue placeholder="Choose a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" size="sm" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  "Run Query"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-end">
            <div className="flex text-sm text-muted-foreground gap-1">
              <span>Powered by</span>
              <span className="flex gap-1 items-center font-medium">
                <img src="/icons/gemini.svg" alt="" className="h-4" />
                Google gemini
              </span>
            </div>
          </CardFooter>
        </Card>
        <SyntaxHighlighter language="json" style={dracula}>
          {JSON.stringify(responseData, null, 2)}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
