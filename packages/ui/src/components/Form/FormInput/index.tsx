import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import { Input, InputProps } from '../../Input'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../Form'

interface FormInputProps<TFieldValues extends FieldValues> extends InputProps {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label?: string
  description?: string
}

export const FormInput = <TFieldValues extends FieldValues>({
  control,
  label,
  description,
  name,
  ...props
}: FormInputProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="md:flex md:items-center">
          <FormLabel className="md:flex-1">{label}</FormLabel>
          <FormControl className="md:flex-[3]">
            <Input {...field} {...props} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
