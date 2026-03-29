import { useState } from "react";

const Apply = () => {
    const [formData, setFormData] = useState({
        name:"",
        email:"",
        pet_id:""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/adoptions", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            alert("Application Submitted");
            setFormData({ name:"", email:"", pet_id:"" });
        } catch (error) {
            console.error(error);
            alert("Error submitting form");
        }
    }

    return (
        <div>
            <h2>Apply for Adoption</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <br /><br />
                <input 
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <br /><br />
                <input 
                    type="number"
                    name="pet_id"
                    placeholder="Pet ID"
                    value={formData.pet_id}
                    onChange={handleChange}
                    required
                />
                <br /><br />
                <button type="submit">Apply</button>
            </form>
        </div>
    )
}

export default Apply;