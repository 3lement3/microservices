"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { globalData } from "../../../digitalniweb-types/models/globalData.js";
import App = globalData.App;
import AppType from "./appType.js";
import Language from "./language.js";
import Module from "./module.js";
import Widget from "./widget.js";

const App = db.define<App>(
	"App",
	{
		id: {
			type: DataTypes.INTEGER,
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
		AppTypeId: {
			type: DataTypes.INTEGER,
			references: {
				model: AppType.tableName,
				key: "id",
			},
		},
		port: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: false,
		},
		host: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		uniqueName: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		apiKey: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		LanguageId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Language.tableName,
				key: "id",
			},
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
		// freezeTableName: true,
	}
);

App.belongsTo(App, { as: "parent", foreignKey: "parentId" });

App.hasOne(App, {
	as: "child",
	foreignKey: "parentId",
});

Language.hasMany(App);
App.belongsTo(Language);

App.hasMany(Module);
App.hasMany(Widget);

App.belongsTo(Language);

App.belongsTo(AppType);

export default App;
