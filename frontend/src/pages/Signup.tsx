import { useForm } from "react-hook-form";
import { apiRequest } from "../lib/api";

type SignupForm = {
    name: string;
    email: string;
    password: string;
};

export default function Signup() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupForm>();

    const onSubmit = async (data: SignupForm) => {
        try {
            const result = await apiRequest("/api/auth/sign-up/email", {
                method: "POST",
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            });

            console.log("Signup successful:", result);
            alert("Account created successfully!");
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "Signup failed");
        }
    };

    return (
        <div>
            <h1>Create Account</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Name</label>
                    <input
                        {...register("name", {
                            required: "Name is required",
                        })}
                    />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                        })}
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters",
                            },
                        })}
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Account..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
}