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

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Destructure register, handleSubmit, and errors directly
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({ 
    resolver: zodResolver(loginSchema) 
  });

  const onSubmit = async (values: LoginForm) => {
    setServerError(null);
    await authClient.signIn.email(values, {
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
        <CardHeader><CardTitle>Log in</CardTitle></CardHeader>
        <CardContent>
          {/* Native HTML form element with standard handleSubmit handler */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
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
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
