import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
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
import { Switch } from "@/components/ui/switch";
import { CircleCheck, CircleX } from "lucide-react";
import { useToastHandler } from "@/contexts/ToastContext";

const API_URL = import.meta.env.VITE_API_URL;

// Validation schema
const settingsSchema = z.object({
  siteName: z
    .string()
    .min(2, { message: "Site name must be at least 2 characters." }),
  siteDescription: z
    .string()
    .min(10, { message: "Site description must be at least 10 characters." }),
  maintenanceMode: z.boolean(),
  maxUploadSize: z
    .number()
    .min(1, { message: "Max upload size must be at least 1 MB." }),
});

export default function SettingsPage() {
  const toastHandler = useToastHandler();

  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      maintenanceMode: false,
      maxUploadSize: 5,
    },
  });

  // Fetch initial maintenance status
  useEffect(() => {
    async function fetchMaintenanceStatus() {
      try {
        const response = await axios.get(`${API_URL}/admin/maintenance`);
        form.setValue("maintenanceMode", response.data.maintenance);
        console.log(
          "Initial maintenance status fetched:",
          response.data.maintenance
        );
      } catch (error) {
        console.error("Error fetching maintenance status:", error);
      }
    }
    fetchMaintenanceStatus();
  }, [form]);

  // Toggle maintenance mode
  async function handleMaintenanceToggle(value) {
    try {
      console.log(form.getValues("maintenanceMode"));

      await axios.post(
        `${API_URL}/admin/maintenance`,
        { value },
        { withCredentials: true }
      );
      console.log("Maintenance mode updated:", value);
      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>{`Maintenance mode turned ${value ? "on" : "off"}`}</span>
        </div>,
        false
      );
    } catch (error) {
      form.setValue("maintenanceMode", false);
      console.error("Error updating maintenance mode:", error);
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
    }
  }

  // Form submit handler
  function onSubmit(data) {
    console.log(data);
    // Replace with API call to save settings
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Maintenance Mode */}
          <FormField
            control={form.control}
            name="maintenanceMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white dark:bg-inherit">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Maintenance Mode</FormLabel>
                  <FormDescription>
                    Disable all user-facing parts of the site.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(value) => {
                      field.onChange(value); // Update form state
                      handleMaintenanceToggle(value); // Trigger API call
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
