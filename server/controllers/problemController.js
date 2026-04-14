const Problem = require("../models/Problem");

// Add Problem
const addProblem = async (req, res) => {
    try {
        const problem = await Problem.create({
            userId: req.user._id,
            ...req.body
        });

        res.status(201).json(problem);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProblems = async (req, res) => {
    try {
        const problems = await Problem.find({ userId: req.user._id });

        res.json(problems);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProblem = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        // Make sure the logged in user matches the problem user
        if (problem.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "User not authorized to delete this problem" });
        }

        await problem.deleteOne();

        res.json({ message: "Problem deleted" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProblem = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        // Make sure the logged in user matches the problem user
        if (problem.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "User not authorized to update this problem" });
        }

        const updatedProblem = await Problem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedProblem);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addProblem, getProblems, deleteProblem, updateProblem };