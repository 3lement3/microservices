import { requestPagination } from "../../../../digitalniweb-custom/helpers/requestPagination.js";
import { CreationAttributes, Op, WhereOperators } from "sequelize";
import { Request, Response, NextFunction } from "express";
import db from "../../../models/index.js";
import { Website as WebsiteType } from "../../../../digitalniweb-types/models/websites.js";
import Website from "../../../models/websites/website.js";
import Url from "../../../models/websites/url.js";
import { getMainServiceRegistryId } from "../../../../digitalniweb-custom/helpers/serviceRegistryCache.js";

export const test = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		/* await db.transaction(async (transaction) => {
			let website = await Website.findOne({
				where: { id: 16 },
				transaction,
			});
			if (!website)
				return next({ code: 404, message: "Website not found." });

			let url = await Url.findOne({ where: { id: 3 }, transaction });

			if (!url) return next({ code: 404, message: "Url not found." });
			await website.addAliases([url], { transaction });
		}); */
		res.send("ok");
	} catch (error) {
		return next({ error, code: 500, message: "Couldn't get website data" });
	}
};
export const getWebsiteInfo = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let { url, paranoid = true } = req.query;
		if (paranoid === "false" || paranoid === "0") paranoid = false; // if paranoid is anything else than string 'false' or '0' (because queries gives me always string) than it is true

		let website = await db.transaction(async (transaction) => {
			return await Website.findOne({
				paranoid: paranoid as boolean, // items with deletedAt set won't occur in search result
				transaction,
				include: [
					{
						model: Url,
						where: {
							"$MainUrl.url$": url,
						},
						attributes: [],
						as: "MainUrl",
					},
				],
			});
		});

		return res.send(website);
	} catch (error) {
		return next({ error, code: 500, message: "Couldn't get website data" });
	}
};

export const testingWebsitesCount = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { userid = undefined } = req.query;
	let where = {} as {
		userId?: number;
	};
	if (userid) where.userId = parseInt(userid as string);
	try {
		let count = await db.transaction(async (transaction) => {
			return await Website.count({
				where,
				transaction,
			});
		});
		return res.send(String(count));
	} catch (error) {
		next({
			error,
			code: 500,
			message: "Couldn't get testing websites count.",
		});
	}
};

export const findTenantWebsites = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { limit, sort, page, sortBy, search } = requestPagination(
			req.query
		);
		let where = {
			userId: parseInt(req.query.userid as string),
		} as { userId: number; url: WhereOperators };
		if (search !== "")
			where["url"] = {
				[Op.like]: `%${search}%`,
			};
		let result = await db.transaction(async (transaction) => {
			return await Website.findAndCountAll({
				where,
				offset: (page - 1) * limit,
				limit,
				order: [[sortBy, sort]],
				paranoid: false,
				transaction,
			});
		});
		return res.send(result);
	} catch (error) {
		next({ error, code: 500, message: "Couldn't get tenant's websites." });
	}
};
export const registerTenant = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { userId, parentId } = req.body;
	let where = {} as {
		userId?: number;
		parentId?: number;
	};
	if (userId) where.userId = userId;
	if (parentId) where.parentId = parentId;
	try {
		let testingWebsitesCount = await db.transaction(async (transaction) => {
			return await Website.count({
				where,
				transaction,
			});
		});
		let maxTestCount = 3;
		if (testingWebsitesCount >= maxTestCount)
			return next({
				code: 403,
				message:
					"You already have a maximum count of testing websites!",
				data: {
					maxTestCount,
				},
			});

		let newTenantWebsite = await db.transaction(async (transaction) => {
			return await Website.create(
				{
					userId: req.body.userId,
					testingMode: true,
					active: true,
					paused: false,
				},
				{
					transaction,
				}
			);
		});

		return res.send({
			uniqueName: newTenantWebsite.uniqueName,
			websiteId: newTenantWebsite.id,
		});
	} catch (error) {
		next({
			error,
			code: 500,
			message: "Couldn't get testing websites count.",
		});
	}
};

export const createwebsite = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let websiteData: CreationAttributes<WebsiteType> = req.body.website;
		let websiteUrl: string = req.body.url;
		if (!websiteData.contentMsId) {
			let mainServiceRegistryId = await getMainServiceRegistryId(
				"content"
			);
			if (mainServiceRegistryId !== null)
				websiteData.contentMsId = mainServiceRegistryId;
		}

		let result: WebsiteType = await db.transaction(async (transaction) => {
			let website = await Website.create(websiteData, {
				transaction,
			});
			let [url] = await Url.findOrCreate({
				where: {
					url: websiteUrl,
				},
				transaction,
			});

			let mainUrl = await website.setMainUrl(url, { transaction });
			website.MainUrlId = mainUrl.id;
			return website;
		});

		return res.send(result);
	} catch (error) {
		next({
			error,
			code: 500,
			message: "Couldn't create website.",
		});
	}
};

export const getWebsiteLanguageMutations = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	// only mutations of website, without main language (which I get with website information)
	try {
		let { url } = req.query;
		let websiteLanguageMutations = await db.transaction(
			async (transaction) => {
				/* return await Language.findAll({
				transaction,
				where: {
					"$Websites.MainUrl.url$": url,
				},
				include: [
					{
						model: Website,
						attributes: [],
						include: [
							{
								model: Url,
								as: "MainUrl",
							},
						],
					},
				],
			}); */
			}
		);
		return res.send(websiteLanguageMutations);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get app languages list.",
		});
	}
};
