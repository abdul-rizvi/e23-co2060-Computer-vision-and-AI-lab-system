const pool = require("../config/db"); //connecting to the database

//get all items
const getAllItems = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM inventory");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching items" });
    }
};

//Post new items
const createItem=async(req,res)=>{
    try {
        const { name, category, description, status, spec, fee, image_url } = req.body;
        if (!name || !category) {
            return res.status(400).json({ message: "Name and category are required" });
        }
        const result = await pool.query(
            "INSERT INTO inventory (name, category, description, spec, fee, status, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [name, category, description, spec, fee, status || 'available', image_url || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating item" });
    }
};

const deleteItem=async(req,res)=>{
    try {
        const {id}=req.params;
        const result = await pool.query("DELETE FROM inventory WHERE id = $1 RETURNING *",[id]);
        if(result.rows.length===0){
            return res.status(404).json({ message: "Item not found"});
        }
        res.status(200).json({
            message: "Item deleted successfully",
            deletedItem: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting item" });
    }
}

// Update an item
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, description, status, spec, fee, image_url } = req.body;
        const result = await pool.query(
            "UPDATE inventory SET name = $1, category = $2, description = $3, status = $4, spec = $5, fee = $6, image_url = $7 WHERE id = $8 RETURNING *",
            [name, category, description, status, spec, fee, image_url || null, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating item" });
    }
};

module.exports = {
    getAllItems,
    createItem,
    deleteItem,
    updateItem
};