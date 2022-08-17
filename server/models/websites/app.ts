"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { websites } from "../../../types/models/websites";
import App = websites.App;
import Website from "./website";

const App = db.define<App>(
	"App",
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
		},
		parentId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [4, 255],
			},
		},
		port: {
			type: DataTypes.INTEGER,
			unique: true,
		},
		AppTypeId: {
			type: DataTypes.INTEGER,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
		// freezeTableName: true,
	}
);

Website.belongsTo(App);

export default App;
