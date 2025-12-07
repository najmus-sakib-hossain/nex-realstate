import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import {
    Controller,
    FormProvider,
    useForm,
    useFormContext,
    type ControllerProps,
    type DefaultValues,
    type FieldPath,
    type FieldValues,
    type Resolver,
    type UseFormReturn,
} from 'react-hook-form';
import type { ZodType } from 'zod';

// ================================
// FORM CONTEXT (shadcn-compatible)
// ================================

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

type FormItemContextValue = {
    id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

// ================================
// FORM ROOT (shadcn-compatible)
// ================================

const Form = FormProvider;

// ================================
// FORM FIELD (shadcn-compatible)
// ================================

function FormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
}

// ================================
// USE FORM FIELD (shadcn-compatible)
// ================================

function useFormField() {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState, formState } = useFormContext();

    const fieldState = getFieldState(fieldContext.name, formState);

    if (!fieldContext) {
        throw new Error('useFormField should be used within <FormField>');
    }

    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
}

// ================================
// FORM ITEM (shadcn-compatible)
// ================================

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        const id = React.useId();

        return (
            <FormItemContext.Provider value={{ id }}>
                <div ref={ref} className={cn('space-y-2', className)} {...props} />
            </FormItemContext.Provider>
        );
    },
);
FormItem.displayName = 'FormItem';

// ================================
// FORM LABEL (shadcn-compatible)
// ================================

const FormLabel = React.forwardRef<
    React.ElementRef<typeof Label>,
    React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField();

    return (
        <Label
            ref={ref}
            className={cn(error && 'text-destructive', className)}
            htmlFor={formItemId}
            {...props}
        />
    );
});
FormLabel.displayName = 'FormLabel';

// ================================
// FORM CONTROL (shadcn-compatible)
// ================================

const FormControl = React.forwardRef<
    React.ElementRef<typeof Slot>,
    React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
        <Slot
            ref={ref}
            id={formItemId}
            aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
            aria-invalid={!!error}
            {...props}
        />
    );
});
FormControl.displayName = 'FormControl';

// ================================
// FORM DESCRIPTION (shadcn-compatible)
// ================================

const FormDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return (
        <p
            ref={ref}
            id={formDescriptionId}
            className={cn('text-sm text-muted-foreground', className)}
            {...props}
        />
    );
});
FormDescription.displayName = 'FormDescription';

// ================================
// FORM MESSAGE (shadcn-compatible)
// ================================

const FormMessage = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
        return null;
    }

    return (
        <p
            ref={ref}
            id={formMessageId}
            className={cn('text-sm font-medium text-destructive', className)}
            {...props}
        >
            {body}
        </p>
    );
});
FormMessage.displayName = 'FormMessage';

// ================================
// FORM INPUT (custom helper)
// ================================

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    description?: string;
}

function FormInput({ label, description, className, ...props }: FormInputProps) {
    const { error } = useFormField();

    return (
        <FormItem>
            {label && <FormLabel>{label}{props.required && <span className="ml-1 text-destructive">*</span>}</FormLabel>}
            <FormControl>
                <Input className={cn(error && 'border-destructive', className)} {...props} />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
        </FormItem>
    );
}

// ================================
// FORM TEXTAREA (custom helper)
// ================================

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    description?: string;
}

function FormTextarea({ label, description, className, ...props }: FormTextareaProps) {
    const { error } = useFormField();

    return (
        <FormItem>
            {label && <FormLabel>{label}{props.required && <span className="ml-1 text-destructive">*</span>}</FormLabel>}
            <FormControl>
                <Textarea className={cn(error && 'border-destructive', className)} {...props} />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
        </FormItem>
    );
}

// ================================
// FORM SELECT (custom helper)
// ================================

interface FormSelectProps {
    label?: string;
    description?: string;
    required?: boolean;
    placeholder?: string;
    options: Array<{ value: string; label: string }>;
    value?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
}

function FormSelect({
    label,
    description,
    required,
    placeholder = 'Select an option',
    options,
    value,
    onValueChange,
    disabled,
}: FormSelectProps) {
    const { error } = useFormField();

    return (
        <FormItem>
            {label && <FormLabel>{label}{required && <span className="ml-1 text-destructive">*</span>}</FormLabel>}
            <Select value={value} onValueChange={onValueChange} disabled={disabled}>
                <FormControl>
                    <SelectTrigger className={cn(error && 'border-destructive')}>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
        </FormItem>
    );
}

// ================================
// SUBMIT BUTTON (custom helper)
// ================================

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingText?: string;
}

function SubmitButton({
    children,
    isLoading,
    loadingText = 'Submitting...',
    disabled,
    className,
    ...props
}: SubmitButtonProps) {
    return (
        <Button
            type="submit"
            disabled={isLoading || disabled}
            className={className}
            {...props}
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingText}
                </>
            ) : (
                children
            )}
        </Button>
    );
}

// ================================
// EXPORTS
// ================================

export {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormInput,
    FormItem,
    FormLabel,
    FormMessage,
    FormSelect,
    FormTextarea,
    SubmitButton,
    useFormField,
};
