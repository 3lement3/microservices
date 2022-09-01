import { QueryInterface, DataTypes } from "sequelize";

import Blacklist from "./../../models/users/Blacklist";
import { users } from "./../../../types/models/users";
import BlacklistType = users.Blacklist;

import { microservices } from "./../../../types";
const microservice: Array<microservices> = ["users"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<BlacklistType>(
				Blacklist.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER.UNSIGNED,
					},
					service: {
						type: DataTypes.STRING,
						allowNull: false,
					},
					type: {
						type: DataTypes.STRING,
						allowNull: false,
					},
					value: {
						type: DataTypes.STRING,
						allowNull: false,
					},
					reason: {
						type: DataTypes.STRING,
					},
					blockedTill: {
						type: DataTypes.DATE,
					},
					otherData: {
						type: DataTypes.JSON,
					},
					createdAt: {
						allowNull: false,
						type: DataTypes.DATE,
					},
					deletedAt: {
						type: DataTypes.DATE,
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
			return await queryInterface.dropTable(Blacklist.tableName, {
				transaction,
			});
		});
	},
};
