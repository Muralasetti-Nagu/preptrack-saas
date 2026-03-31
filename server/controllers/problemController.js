const Problem = require("../models/Problem");

// Add Problem
const addProblem = async (req, res) => {
    try {
        const problem = await Problem.create({
            userId: req.user,
            ...req.body
        });

        res.status(201).json(problem);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProblems = async (req, res) => {
    try {
        const problems = await Problem.find({ userId: req.user });

        res.json(problems);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProblem = async (req, res) => {
    try {
        await Problem.findByIdAndDelete(req.params.id);

        res.json({ message: "Problem deleted" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addProblem, getProblems, deleteProblem };