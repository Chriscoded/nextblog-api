import mongoose, { Schema, models, model } from "mongoose";
import User from "./User";

const categorySchema = new Schema (
    { 
        title: {type: "string", required: true},
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // <-- Ensure this is included if you want to populate later
            required: true,
          },
    },
    { timestamps : true}
);

// const Category = models.Category || model("Category", categorySchema)
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;