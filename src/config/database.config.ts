import mongoose from "mongoose";
import { config } from "./app.config";
import RoleModel from "../models/roles-permission.model";
import { Roles } from "../enums/role.enum";
import { RolePermissions } from "../utils/role-permission";

const connectDatabase = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("✅ Connected to Mongo database");

        // Ensure roles exist
        await seedRoles();
    } catch (error) {
        console.error("❌ Error connecting to Mongo database:", error);
        process.exit(1);
    }
};

// Function to seed roles if missing
const seedRoles = async () => {
    try {
        const existingOwnerRole = await RoleModel.findOne({
            name: Roles.OWNER,
        });

        if (!existingOwnerRole) {
            console.log("⚠️  Owner role not found. Creating...");
            await RoleModel.create({
                name: Roles.OWNER,
                permissions: RolePermissions[Roles.OWNER] || ["full_access"],
            });
            console.log("✅ Owner role created successfully.");
        } else {
            console.log("✅ Owner role already exists.");
        }
    } catch (error) {
        console.error("❌ Error seeding roles:", error);
    }
};

export default connectDatabase;
