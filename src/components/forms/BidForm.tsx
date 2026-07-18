
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  EQUIPMENT_BRANDS,
  OTHER_BRAND_VALUE,
  TIER_GROUPS,
  tierFromBrand,
} from '@/lib/equipmentBrands';

const makeBidSchema = (mode: 'per_watt' | 'total') =>
  z
    .object({
      price_per_watt: mode === 'per_watt'
        ? z.coerce.number().min(10, { message: 'Price must be at least ₹10 per Watt' }).max(200, { message: 'Price cannot exceed ₹200 per Watt' })
        : z.coerce.number().min(0).optional(),
      total_bid_amount: mode === 'total'
        ? z.coerce.number().min(1000, { message: 'Bid amount must be at least ₹1,000' })
        : z.coerce.number().optional(),
      equipment_brand: z.string().min(1, { message: 'Please select an equipment brand' }),
      equipment_tier: z.enum(['tier1', 'tier2', 'tier3']),
      equipment_details: z.string().optional(),
      timeline_days: z.coerce.number().min(7, { message: 'Timeline must be at least 7 days' }).max(180, { message: 'Timeline cannot exceed 180 days' }),
      amc_included: z.boolean().default(false),
    })
    .refine(
      (data) =>
        data.equipment_brand !== OTHER_BRAND_VALUE ||
        (data.equipment_details && data.equipment_details.trim().length >= 3),
      { message: 'Please describe your equipment', path: ['equipment_details'] },
    );

type BidFormValues = z.infer<ReturnType<typeof makeBidSchema>>;

interface BidFormProps {
  onSubmit: (data: BidFormValues) => void;
  initialData?: Partial<BidFormValues>;
  projectSize?: number;
  mode?: 'per_watt' | 'total';
}

const BidForm: React.FC<BidFormProps> = ({ onSubmit, initialData, projectSize = 5, mode = 'per_watt' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const [otherDraft, setOtherDraft] = useState('');
  const bidSchema = React.useMemo(() => makeBidSchema(mode), [mode]);

  const form = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      price_per_watt: 45,
      equipment_brand: '',
      equipment_tier: 'tier2',
      equipment_details: '',
      timeline_days: 30,
      amc_included: false,
      ...initialData,
    },
  });

  const pricePerWatt = form.watch('price_per_watt') ?? 0;
  const totalBidAmount = form.watch('total_bid_amount') ?? 0;
  const equipmentBrand = form.watch('equipment_brand');
  const equipmentDetails = form.watch('equipment_details');
  const totalProjectCost = (pricePerWatt || 0) * projectSize * 1000;
  const derivedPerWatt = projectSize > 0 && totalBidAmount ? totalBidAmount / (projectSize * 1000) : 0;
  const isOther = equipmentBrand === OTHER_BRAND_VALUE;

  const handleBrandChange = (value: string) => {
    form.setValue('equipment_brand', value, { shouldValidate: true });
    if (value === OTHER_BRAND_VALUE) {
      setOtherDraft(form.getValues('equipment_details') || '');
      setOtherOpen(true);
      form.setValue('equipment_tier', 'tier2');
    } else {
      form.setValue('equipment_tier', tierFromBrand(value));
      form.setValue('equipment_details', '');
    }
  };

  const handleSubmit = async (data: BidFormValues) => {
    setIsSubmitting(true);
    try {
      const payload =
        mode === 'total'
          ? {
              ...data,
              price_per_watt:
                projectSize > 0 && data.total_bid_amount
                  ? Number((data.total_bid_amount / (projectSize * 1000)).toFixed(4))
                  : 0,
            }
          : data;
      await onSubmit(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {mode === 'per_watt' ? (
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
        ) : (
          <FormField
            control={form.control}
            name="total_bid_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total bid amount (₹)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" placeholder="e.g. 225000" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your total bid amount based on your own calculations.
                  {totalBidAmount > 0 && projectSize > 0 && (
                    <span className="block mt-1 font-medium text-sbs-purple">
                      ₹{Number(totalBidAmount).toLocaleString('en-IN')}
                      {totalBidAmount >= 100000 && ` (₹${(totalBidAmount / 100000).toFixed(2)}L)`}
                      {' · '}~₹{derivedPerWatt.toFixed(2)}/W for a {projectSize} kW system
                    </span>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="equipment_brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment Brand</FormLabel>
              <Select value={field.value} onValueChange={handleBrandChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment brand" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TIER_GROUPS.map((group) => (
                    <SelectGroup key={group.tier}>
                      <SelectLabel>{group.label}</SelectLabel>
                      {EQUIPMENT_BRANDS.filter((b) => b.tier === group.tier).map((b) => (
                        <SelectItem key={b.value} value={b.value}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                  <SelectGroup>
                    <SelectLabel>Custom</SelectLabel>
                    <SelectItem value={OTHER_BRAND_VALUE}>Other (enter details)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the brand you will install. Tier is auto-assigned. Pick "Other" to enter custom equipment details.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isOther && (
          <FormField
            control={form.control}
            name="equipment_details"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Custom equipment details</FormLabel>
                  <Button type="button" size="sm" variant="ghost" onClick={() => { setOtherDraft(field.value || ''); setOtherOpen(true); }}>
                    Edit
                  </Button>
                </div>
                <FormControl>
                  <Textarea rows={3} placeholder="Brand, model, wattage, warranty, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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

      <Dialog open={otherOpen} onOpenChange={setOtherOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Custom equipment details</DialogTitle>
            <DialogDescription>
              Describe the panels/inverters you plan to use so the customer can evaluate your bid.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Textarea
              rows={5}
              placeholder="e.g. Vikram Solar 540W mono-PERC panels, Deye 5kW hybrid inverter, 25-year performance warranty"
              value={otherDraft}
              onChange={(e) => setOtherDraft(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOtherOpen(false);
                if (!equipmentDetails) {
                  form.setValue('equipment_brand', '', { shouldValidate: true });
                }
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-sbs-orange hover:bg-sbs-orange/90 text-white"
              onClick={() => {
                form.setValue('equipment_details', otherDraft, { shouldValidate: true });
                setOtherOpen(false);
              }}
            >
              Save details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default BidForm;
