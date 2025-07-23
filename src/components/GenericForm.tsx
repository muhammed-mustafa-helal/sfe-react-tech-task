import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

export type FormType = 'login' | 'create' | 'update';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'select';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface GenericFormProps {
  type: FormType;
  schema: any;
  defaultValues: Record<string, any>;
  fields: FormField[];
  onSubmit: (values: any) => Promise<void>;
  isPending?: boolean;
  error?: Error | null;
  initialData?: Record<string, any>;
}

export function GenericForm({
  type,
  schema,
  defaultValues,
  fields,
  onSubmit,
  isPending = false,
  error = null,
  initialData,
}: GenericFormProps) {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (type === 'update' && initialData) {
      methods.reset({ 
        username: initialData.username, 
        password: '', 
        role: initialData.role 
      });
    }
  }, [initialData, methods, type]);

  const watched = methods.watch();

  const hasChanges = type === 'update' && initialData ? (
    watched.username !== initialData.username ||
    (watched.password && watched.password.length > 0) ||
    watched.role !== initialData.role
  ) : true;

  const getButtonText = () => {
    if (isPending) {
      switch (type) {
        case 'login': return 'Logging in...';
        case 'create': return 'Creating...';
        case 'update': return 'Updating...';
        default: return 'Loading...';
      }
    }
    
    switch (type) {
      case 'login': return 'Login';
      case 'create': return 'Create User';
      case 'update': return 'Update User';
      default: return 'Submit';
    }
  };

  const getButtonDisabled = () => {
    if (isPending) return true;
    if (type === 'update') {
      return !hasChanges || !methods.formState.isValid;
    }
    return !methods.formState.isValid;
  };

  const renderField = (field: FormField) => {
    const isRequired = field.required !== false;
    
    switch (field.type) {
      case 'text':
      case 'password':
        return (
          <FormField
            key={field.name}
            name={field.name}
            control={methods.control}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>
                  {field.label} {isRequired && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    id={field.name}
                    type={field.type}
                    {...formField}
                    placeholder={field.placeholder}
                    autoFocus={field.name === 'username'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case 'select':
        return (
          <FormField
            key={field.name}
            name={field.name}
            control={methods.control}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>
                  {field.label} {isRequired && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={formField.onChange}
                    value={formField.value || (type === 'update' && initialData ? initialData[field.name] : '')}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
        {methods.formState.isSubmitSuccessful && (
          <div className="mb-4 rounded-md bg-green-100 border border-green-300 text-green-800 px-4 py-2 text-center font-medium">
            {type === 'create' ? 'User created successfully' : 'User updated successfully'}
          </div>
        )}
        
        {fields.map(renderField)}
        
        {error && (
          <div className="text-destructive text-sm">
            {error.message}
          </div>
        )}
        
        {type === 'update' && isPending && (
          <div className="text-muted-foreground text-sm">Updating...</div>
        )}
        
        <Button 
          className="w-full" 
          type="submit" 
          disabled={getButtonDisabled()}
        >
          {getButtonText()}
        </Button>
      </form>
    </FormProvider>
  );
} 