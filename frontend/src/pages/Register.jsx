import { useState } from "react";

const Register = () => {
    const [data, setData] = useState({ name: "", email: "", password: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Registered Successfully");
    }

    return (
        <div className="container">
            <h2>Register</h2>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <input placeholder="Name" onChange={e => setData({ ...data, name: e.target.value })} />
                    <br /><br />
                    <input placeholder="Email" onChange={e => setData({ ...data, email: e.target.value })} />
                    <br /><br />
                    <input type="password" placeholder="Password" onChange={e => setData({ ...data, password: e.target.value })} />
                    <br /><br />
                    <button>Register</button>
                </form>
            </div>
        </div>
    )
}

export default Register;