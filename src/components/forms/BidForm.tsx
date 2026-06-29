
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const bidSchema = z.object({
  price_per_watt: z.coerce.number().min(10, { message: 'Price must be at least ₹10 per Watt' }).max(200, { message: 'Price cannot exceed ₹200 per Watt' }),
  equipment_tier: z.enum(['tier1', 'tier2', 'tier3'], { required_error: 'Please select equipment tier' }),
  timeline_days: z.coerce.number().min(7, { message: 'Timeline must be at least 7 days' }).max(180, { message: 'Timeline cannot exceed 180 days' }),
  amc_included: z.boolean().default(false),
});

type BidFormValues = z.infer<typeof bidSchema>;

interface BidFormProps {
  onSubmit: (data: BidFormValues) => void;
  initialData?: BidFormValues;
  projectSize?: number;
}

const BidForm: React.FC<BidFormProps> = ({ onSubmit, initialData, projectSize = 5 }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: initialData || {
      price_per_watt: 45,
      equipment_tier: 'tier2',
      timeline_days: 30,
      amc_included: false,
    },
  });

  const pricePerWatt = form.watch('price_per_watt');
  const totalProjectCost = pricePerWatt * projectSize * 1000; // Converting kW to Watt

  const handleSubmit = async (data: BidFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="price_per_watt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per Watt (₹)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormDescription>
                Your bid price per Watt.
                {pricePerWatt && projectSize && (
                  <span className="block mt-1 font-medium text-sbs-purple">
                    Total project cost: ₹{(totalProjectCost).toLocaleString('en-IN')} 
                    {totalProjectCost >= 100000 && ` (₹${(totalProjectCost / 100000).toFixed(2)}L)`}
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="equipment_tier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment Tier</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment tier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="tier1">Tier 1 (Premium Brands)</SelectItem>
                  <SelectItem value="tier2">Tier 2 (Standard Brands)</SelectItem>
                  <SelectItem value="tier3">Tier 3 (Budget Brands)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Higher tier equipment typically offers better quality and longer warranties.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeline_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timeline (days)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Estimated days to complete the installation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amc_included"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Include AMC</FormLabel>
                <FormDescription>
                  Annual Maintenance Contract for 5 years
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-sbs-orange hover:bg-sbs-orange-light text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Bid'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default BidForm;
