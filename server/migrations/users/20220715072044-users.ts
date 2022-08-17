import { QueryInterface, DataTypes } from "sequelize";

import User from "./../../models/users/user";
import { users } from "./../../../types/models/users";
import UserType = users.User;

import Role from "./../../models/users/role";

import { microservices } from "./../../../types";
const microservice: Array<microservices> = ["users"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<UserType>(
				User.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					nickname: {
						type: DataTypes.STRING(255),
						unique: true,
						allowNull: true,
					},
					email: {
						type: DataTypes.STRING,
						allowNull: true,
					},
					password: {
						type: DataTypes.STRING,
						allowNull: false,
					},
					refreshTokenSalt: {
						type: DataTypes.STRING(20),
						allowNull: false,
					},
					RoleId: {
						type: DataTypes.INTEGER,
						references: {
							model: Role.tableName,
							key: "id",
						},
					},
					domainId: {
						type: DataTypes.INTEGER.UNSIGNED,
					},
					active: {
						type: DataTypes.BOOLEAN,
						allowNull: false,
						defaultValue: true,
					},
					createdAt: {
						allowNull: false,
						type: DataTypes.DATE,
					},
					updatedAt: {
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
			return await queryInterface.dropTable(User.tableName, {
				transaction,
			});
		});
	},
};
