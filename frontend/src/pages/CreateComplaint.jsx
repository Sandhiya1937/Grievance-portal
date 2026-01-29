import { useState } from "react";
import { axiosInstance } from "../services/api";
import { useNavigate } from "react-router-dom";

function CreateComplaint() {
  const [form, setForm] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  const submitComplaint = async () => {
    await axiosInstance.post("/complaints", form);
    navigate("/dashboard");
  };

  return (
    <div>
      <h2>Create Complaint</h2>
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <button onClick={submitComplaint}>Submit</button>
    </div>
  );
}

export default CreateComplaint;
