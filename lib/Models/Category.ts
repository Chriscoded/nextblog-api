import { Schema, models, model } from "mongoose";
import User from "./User";

const CategorySchema = new Schema (
    { 
        title: {type: "string", required: true},
        User: {tyep: Schema.Types.ObjectId, ref: User }
    },
    { timestamps : true}
);

const Category = models.Category || model("Category", CategorySchema)

export default Category;