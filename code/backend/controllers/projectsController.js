const pool = require("../config/db");

const getAllProjects = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM projects ORDER BY id DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching projects" });
    }
};

const createProject = async (req, res) => {
    try {
        const { title, description, lead, supervisor, tags, year, status, github_link, demo_link, image_url, video_url } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        const result = await pool.query(
            "INSERT INTO projects (title, description, lead, supervisor, tags, year, status, github_link, demo_link, image_url, video_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
            [title, description, lead, supervisor, tags, year, status, github_link, demo_link, image_url, video_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating project" });
    }
};

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, lead, supervisor, tags, year, status, github_link, demo_link, image_url, video_url } = req.body;
        const result = await pool.query(
            "UPDATE projects SET title = $1, description = $2, lead = $3, supervisor = $4, tags = $5, year = $6, status = $7, github_link = $8, demo_link = $9, image_url = $10, video_url = $11 WHERE id = $12 RETURNING *",
            [title, description, lead, supervisor, tags, year, status, github_link, demo_link, image_url, video_url, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating project" });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM projects WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting project" });
    }
};

module.exports = {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject
};
