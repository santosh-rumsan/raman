'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rumsan/shadcn-ui/components/button';
import { DialogClose, DialogFooter } from '@rumsan/shadcn-ui/components/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@rumsan/shadcn-ui/components/form';
import { Input } from '@rumsan/shadcn-ui/components/input';
import { CurrencyAmountField } from '@rumsan/ui/components/currency-amount.field';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { accountSchema } from './schema';

interface CommonAccountFormProps {
    onSubmit: (data: any) => void;
    defaultValues?: any;

    isEdit?: boolean;
    onCancel?: () => void;
}

export function CommonAccountForm({
    onSubmit,
    defaultValues,

    isEdit = false,
    onCancel,
}: CommonAccountFormProps) {
    type FormData = z.infer<typeof accountSchema>;

    const form = useForm<FormData>({
        resolver: zodResolver(accountSchema),
        defaultValues: defaultValues,
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">Account Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter Account name"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        form.trigger('name');
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="acctNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">Account Number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter Account Number"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        form.trigger('acctNumber');
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="currency"
                    render={() => (
                        <FormItem>
                            <FormLabel>Balance</FormLabel>
                            <FormControl>
                                <CurrencyAmountField
                                    currencyName="currency"
                                    amountName="balance"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter className="mx-auto sm:justify-center mt-3">
                    <DialogClose asChild>
                        <Button
                            className="min-w-[12rem]"
                            variant="secondary"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button className="min-w-[12rem] fw-[600]" type="submit">
                        {isEdit ? 'Save Changes' : 'Add'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
