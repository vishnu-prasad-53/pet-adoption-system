import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Apply = () => {
    const location = useLocation();
    const petId = location.state || "";
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        pet_id: petId
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        
        if (!user) {
            alert("Please login first");
            navigate("/login");
        }
    }, []);
        
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/adoptions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
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
                <label>Name</label>
                <input
                    required
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                />

                <label>Email</label>
                <input
                    required
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                />

                <label>Pet ID</label>
                <input value={formData.pet_id} readOnly />

                <br /><br />

                <button type="submit">Submit Application</button>
            </form>
        </div>
    )
}

export default Apply;