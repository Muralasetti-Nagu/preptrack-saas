import { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";
import { fetchAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

export const AddProblem = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    platform: "LeetCode",
    difficulty: "Easy",
    topic: "",
    company: "",
    status: "Solved",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetchAPI("/problems", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      navigate("/problems");
    } catch (err) {
      alert(err.message || "Failed to add problem");
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-textMain">Add New Problem</h2>
          <p className="text-textDim mt-1">Track a new question you have completed or want to revise.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Problem Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-textMain">Title <span className="text-hard">*</span></label>
                <Input name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. valid palindrome" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-textMain">Platform <span className="text-hard">*</span></label>
                  <Select name="platform" required value={formData.platform} onChange={handleChange}>
                    <option value="LeetCode">LeetCode</option>
                    <option value="HackerRank">HackerRank</option>
                    <option value="Codeforces">Codeforces</option>
                    <option value="GeeksForGeeks">GeeksForGeeks</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-textMain">Difficulty <span className="text-hard">*</span></label>
                  <Select name="difficulty" required value={formData.difficulty} onChange={handleChange}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-textMain">Topic <span className="text-hard">*</span></label>
                  <Input name="topic" required value={formData.topic} onChange={handleChange} placeholder="e.g. Two Pointers, DP" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-textMain">Company (Optional)</label>
                  <Input name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Google, Amazon" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-textMain">Status</label>
                <Select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Solved">Solved</option>
                  <option value="Revision">Revision</option>
                </Select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Problem"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
