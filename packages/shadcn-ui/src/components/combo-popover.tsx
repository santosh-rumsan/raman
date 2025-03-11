'use client';

import * as React from 'react';

import { Button } from '@rumsan/shadcn-ui/components/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@rumsan/shadcn-ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rumsan/shadcn-ui/components/popover';

interface ComboboxPopoverProps {
  label: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
  selectedValue?: string;
  placeholder?: string;
  className?: string;
}

export function ComboboxPopover({
  label,
  options,
  onSelect,
  selectedValue,
  placeholder = 'Select an option',
  className = '',
}: ComboboxPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<{
    value: string;
    label: string;
  } | null>(options?.find((option) => option.value === selectedValue) || null);

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={`justify-start ${className}`}>
            {selectedOption ? <>{selectedOption.label}</> : <>{placeholder}</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder={`Change ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options?.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(value: any) => {
                      const selected =
                        options.find((opt) => opt.value === value) || null;
                      setSelectedOption(selected);
                      onSelect(value);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
