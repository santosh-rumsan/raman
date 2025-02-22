'use client';

import { Button } from '@rumsan/shadcn-ui/components/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rumsan/shadcn-ui/components/form';
import { Input } from '@rumsan/shadcn-ui/components/input';
import { useToast } from '@rumsan/shadcn-ui/hooks/use-toast';
import { PlusIcon, X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

interface ExpenseAttachmentProps {
  files: File[];
  setFiles: (files: File[] | ((prevFiles: File[]) => File[])) => void;
  id: string;
}

export default function ExpenseAttachment({
  files,
  setFiles,
  id,
}: ExpenseAttachmentProps) {
  const { toast } = useToast();

  const handleFilesChange = (selectedFiles: FileList) => {
    const fileList = Array.from(selectedFiles);
    setFiles([...files, ...fileList]);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles: File[]) => prevFiles.filter((_, i) => i !== index));
  };

  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={id}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Attachments</FormLabel>
          <FormControl>
            <div className="space-y-2">
              {field?.value?.map((url: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input value={url} readOnly />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newAttachments = [...field.value];
                      newAttachments.splice(index, 1);
                      field.onChange(newAttachments);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Select Attachment"
                  readOnly
                  onChange={(e) => {
                    if (e.target.value) {
                      field.onChange([...field.value, e.target.value]);
                      e.target.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.multiple = true;
                    input.onchange = (e) => {
                      const target = e.target as HTMLInputElement | null;
                      if (target && target.files) {
                        const fileList = Array.from(target.files);

                        const duplicateFiles: string[] = [];
                        const newFiles = fileList.filter((file) => {
                          const isDuplicate = files.some(
                            (existingFile) => existingFile.name === file.name,
                          );
                          if (isDuplicate) {
                            duplicateFiles.push(file.name);
                          }
                          return !isDuplicate;
                        });

                        if (duplicateFiles.length > 0) {
                          if (newFiles.length === 0) {
                            toast({
                              description: 'Duplicate images are not allowed',
                              variant: 'destructive',
                              duration: 3000,
                            });
                          } else {
                            toast({
                              description: `The following files already exist: ${duplicateFiles.join(
                                ', ',
                              )}. Uploading only new files.`,
                              variant: 'default',
                              duration: 3000,
                            });
                          }
                        }

                        if (newFiles.length > 0) {
                          handleFilesChange(target.files);
                          const placeholderUrls = newFiles.map(
                            (file) => file.name,
                          );
                          field.onChange([...field.value, ...placeholderUrls]);
                        }
                      }
                    };
                    input.click();
                  }}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
