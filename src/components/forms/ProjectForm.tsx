
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { INDIAN_STATES, STATE_SUBSIDIES } from '@/types';

const projectSchema = z.object({
  title: z.string().min(5, { message: 'Project title must be at least 5 characters' }),
  location: z.string().min(3, { message: 'Location is required' }),
  system_size: z.coerce.number().min(1, { message: 'System size must be at least 1kW' }),
  budget: z.coerce.number().min(10000, { message: 'Budget must be at least ₹10,000' }),
  description: z.string().min(20, { message: 'Please provide a more detailed description' }),
  state: z.string().min(1, { message: 'State is required' }),
  subsidy_applied: z.boolean().default(false),
});

interface ProjectFormProps {
  onSubmit: (data: z.infer<typeof projectSchema>) => void;
  initialData?: z.infer<typeof projectSchema>;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, initialData }) => {
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      title: '',
      location: '',
      system_size: 5,
      budget: 250000,
      description: '',
      state: '',
      subsidy_applied: false,
    },
  });

  const selectedState = form.watch('state');
  const hasSubsidy = STATE_SUBSIDIES[selectedState] !== undefined;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Residential Rooftop Solar Installation" {...field} />
              </FormControl>
              <FormDescription>
                A clear title helps vendors understand your project quickly.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Indiranagar, Bengaluru" {...field} />
                </FormControl>
                <FormDescription>
                  Specific location for installation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state} {STATE_SUBSIDIES[state] ? `(Subsidy Available: ${STATE_SUBSIDIES[state]}%)` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="system_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>System Size (in kW)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormDescription>
                  Estimated system capacity required.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (₹)</FormLabel>
                <FormControl>
                  <Input type="number" step="1000" {...field} />
                </FormControl>
                <FormDescription>
                  Your approximate budget for the project.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {hasSubsidy && (
          <FormField
            control={form.control}
            name="subsidy_applied"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Apply {selectedState} Subsidy</FormLabel>
                  <FormDescription>
                    {STATE_SUBSIDIES[selectedState]}% subsidy available for solar installations in {selectedState}.
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
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide details about your requirements, site conditions, and any specific preferences..."
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Detailed description helps vendors provide accurate bids.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-sbs-purple hover:bg-sbs-purple-dark text-white">
          Submit Project
        </Button>
      </form>
    </Form>
  );
};

export default ProjectForm;
