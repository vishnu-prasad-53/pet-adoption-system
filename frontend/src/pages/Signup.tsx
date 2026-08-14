import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "../lib/auth-client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Field, FieldLabel, FieldError } from "../components/ui/field";
import { useNavigate } from "react-router";

const navigate = useNavigate();

const signupSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({ 
    resolver: zodResolver(signupSchema) 
  });

  const onSubmit = async (values: SignupForm) => {
    setServerError(null);
    await authClient.signUp.email(values, {
      onRequest: () => setIsSubmitting(true),
      onSuccess: () => {
  setIsSubmitting(false);
  navigate("/");
},
      onError: (ctx) => {
        setIsSubmitting(false);
        setServerError(ctx.error.message);
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader><CardTitle>Create an account</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Name Field */}
            <Field data-invalid={!!errors.name}>
              <FieldLabel>Name</FieldLabel>
              <Input aria-invalid={!!errors.name} {...register("name")} />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            {/* Email Field */}
            <Field data-invalid={!!errors.email}>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" aria-invalid={!!errors.email} {...register("email")} />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            {/* Password Field */}
            <Field data-invalid={!!errors.password}>
              <FieldLabel>Password</FieldLabel>
              <Input type="password" aria-invalid={!!errors.password} {...register("password")} />
              {errors.password && <FieldError>{errors.password.message}</FieldError>}
            </Field>

            {serverError && <p className="text-sm text-red-500">{serverError}</p>}
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
