import { CreationAttributes } from "sequelize";

import { users } from "./models/users.js";
import LoginLog = users.LoginLog;
import { microservicesArray } from "../custom/variables/microservices.js";
export type microservices = typeof microservicesArray[number];

export type possibleRoles =
	| "superadmin"
	| "owner"
	| "admin"
	| "tenant"
	| "user";

export interface loginAttempt extends CreationAttributes<LoginLog> {}
