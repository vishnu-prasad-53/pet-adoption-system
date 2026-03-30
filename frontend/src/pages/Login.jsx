import { useState } from "react";

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Login Successful");
    }

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Email" onChange={e => setData({...data, email:e.target.value})} />
                <br /><br />
                <input type="password" placeholder="Password" onChange={e => setData({...data, password:e.target.value})} />
                <br /><br />
                <button>Login</button>
            </form>
        </div>
    )
}

export default Login;