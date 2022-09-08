import { QueryInterface, DataTypes } from "sequelize";

import { websites } from "../../../types/models/websites";
import AppLanguageType = websites.AppLanguage;

import { microservices } from "../../../types";
import AppLanguage from "../../models/websites/appLanguage";
import Language from "../../models/websites/language";
import App from "../../models/websites/app";

const microservice: Array<microservices> = ["websites"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<AppLanguageType>(
				AppLanguage.tableName,
				{
					AppId: {
						type: DataTypes.INTEGER,
						references: {
							model: App.tableName,
							key: "id",
						},
					},
					LanguageId: {
						type: DataTypes.INTEGER,
						references: {
							model: Language.tableName,
							key: "id",
						},
					},
				},
				{
					charset: "utf8mb4",
					collate: "utf8mb4_unicode_ci",
					transaction,
				}
			);
		});
	},

	down: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(AppLanguage.tableName, {
				transaction,
			});
		});
	},
};
