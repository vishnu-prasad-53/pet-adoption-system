import { useState } from "react";
import { useLocation } from "react-router-dom";

const Apply = () => {
    const location = useLocation();
    const petId = location.state || "";
    const [formData, setFormData] = useState({
        name:"",
        email:"",
        pet_id:petId
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
            alert("Application Submitted");
        } catch (error) {
            console.error(error);
            alert("Error submitting form");
        }
    }

    return (
        <div className="container">
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