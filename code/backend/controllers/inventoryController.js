const pool = require("../config/db"); //connecting to the database
const xlsx = require('xlsx');

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
        const { name, category, description } = req.body;
        if (!name || !category) {
            return res.status(400).json({ message: "Name and category are required" });
        }
        const result = await pool.query(
            "INSERT INTO inventory (name, category, description) VALUES ($1, $2, $3) RETURNING *",
            [name, category, description]
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
            message: "Item deleted succesfully",
            deletItem: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting item" });
    }
}

// Controller to handle Excel file import
const importEquipmentData = async (req, res) => {
    try {
        // Check if the user is an admin
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can import data.' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Read the uploaded Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Insert data into the database
        for (const item of data) {
            // Adjust item.name, item.type etc. to match exactly what your Excel column headers are called!
            await pool.query(
                'INSERT INTO inventory (name, category, description, status) VALUES ($1, $2, $3, $4)', 
                [
                    item.name, 
                    item.type, 
                    item.description || 'Added via CSV', 
                    'available'
                ]
            );
        }

        res.status(200).json({ message: 'Equipment data imported successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error importing equipment data', error });
    }
};

module.exports = {
    getAllItems,
    createItem,
    deleteItem,
    importEquipmentData
};