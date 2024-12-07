import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

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
  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: "My Social Media App",
      siteDescription: "A platform for connecting people",
      maintenanceMode: false,
      maxUploadSize: 5,
    },
  });

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
          {/* Site Name */}
          <FormField
            control={form.control}
            name="siteName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of your social media platform.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Site Description */}
          <FormField
            control={form.control}
            name="siteDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  Briefly describe your social media platform.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Maintenance Mode */}
          <FormField
            control={form.control}
            name="maintenanceMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Maintenance Mode</FormLabel>
                  <FormDescription>
                    Disable all user-facing parts of the site.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Max Upload Size */}
          <FormField
            control={form.control}
            name="maxUploadSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Upload Size (MB)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Maximum file size for user uploads in megabytes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <Button type="submit">Save Settings</Button>
        </form>
      </Form>
    </div>
  );
}
