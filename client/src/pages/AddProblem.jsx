import { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";
import { fetchAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { FileText, Globe, Signal, Tag, Building, CheckSquare } from "lucide-react";

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
      <style>{`
        .addproblem-card {
          border-radius: 1rem;
          border: 1px solid rgba(226, 232, 240, 0.7);
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
          animation: addFadeUp 0.5s ease-out both;
          animation-delay: 100ms;
        }
        .addproblem-gradient-text {
          background: linear-gradient(135deg, #0f172a 0%, #475569 50%, #0f172a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .field-icon {
          color: #94a3b8;
          flex-shrink: 0;
        }
        @keyframes addFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div style={{ animation: 'addFadeUp 0.3s ease-out both' }}>
          <h2 className="text-3xl font-extrabold tracking-tight addproblem-gradient-text">Add New Problem</h2>
          <p className="text-slate-400 mt-2 text-sm font-medium">Track a question you have completed or want to revise.</p>
        </div>

        {/* Form Card */}
        <div className="addproblem-card">
          <div className="border-b border-slate-100/80 px-7 py-5">
            <h3 className="text-base font-semibold text-slate-800">Problem Details</h3>
            <p className="text-xs text-slate-400 mt-0.5">Fill in the details about the problem</p>
          </div>

          <div className="p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FileText className="field-icon h-3.5 w-3.5" />
                  Title <span className="text-rose-500">*</span>
                </label>
                <Input name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Valid Palindrome" />
              </div>

              {/* Platform + Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Globe className="field-icon h-3.5 w-3.5" />
                    Platform <span className="text-rose-500">*</span>
                  </label>
                  <Select name="platform" required value={formData.platform} onChange={handleChange}>
                    <option value="LeetCode">LeetCode</option>
                    <option value="HackerRank">HackerRank</option>
                    <option value="Codeforces">Codeforces</option>
                    <option value="GeeksForGeeks">GeeksForGeeks</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Signal className="field-icon h-3.5 w-3.5" />
                    Difficulty <span className="text-rose-500">*</span>
                  </label>
                  <Select name="difficulty" required value={formData.difficulty} onChange={handleChange}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </Select>
                </div>
              </div>

              {/* Topic + Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Tag className="field-icon h-3.5 w-3.5" />
                    Topic <span className="text-rose-500">*</span>
                  </label>
                  <Input name="topic" required value={formData.topic} onChange={handleChange} placeholder="e.g. Two Pointers, DP" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Building className="field-icon h-3.5 w-3.5" />
                    Company <span className="text-slate-300 text-xs font-normal">(Optional)</span>
                  </label>
                  <Input name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Google, Amazon" />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <CheckSquare className="field-icon h-3.5 w-3.5" />
                  Status
                </label>
                <Select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Solved">Solved</option>
                  <option value="Revision">Revision</option>
                </Select>
              </div>

              {/* Actions */}
              <div className="pt-5 flex justify-end gap-3 border-t border-slate-100/80">
                <Button type="button" variant="secondary" onClick={() => navigate("/dashboard")}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Problem"}</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
