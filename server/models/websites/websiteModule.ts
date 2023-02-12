"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { websites } from "../../../digitalniweb-types/models/websites.js";
import WebsiteModule = websites.WebsiteModule;

const WebsiteModule = db.define<WebsiteModule>(
	"WebsiteModule",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		WebsiteId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		moduleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		billingDay: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1,
				max: 31,
			},
		},
	},
	{
		timestamps: true,
		updatedAt: false,
		paranoid: true,
	}
);

export default WebsiteModule;
