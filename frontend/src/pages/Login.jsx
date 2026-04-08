import { useState } from "react";

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:5000/api/users/login",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

        const result = await res.json();
        alert(result.message);
    }

    return (
        <div className="container">
            <h2>Login</h2>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <input placeholder="Email" onChange={e => setData({ ...data, email: e.target.value })} />
                    <br /><br />
                    <input type="password" placeholder="Password" onChange={e => setData({ ...data, password: e.target.value })} />
                    <br /><br />
                    <button>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login;