import { Request, Response, NextFunction } from "express";
import App from "../../../models/globalData/app.js";
import { registerApp } from "../../../../custom/helpers/globalData/app.js";
import { appOptions } from "../../../../digitalniweb-types/customFunctions/globalData.js";

export const getApp = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let { name } = req.query as { name?: string };
		if (!name) return false;
		let appInfo = await App.findOne({
			where: {
				name,
			},
		});
		return res.send(appInfo);
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const register = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let app = await registerApp(req.body as appOptions);

		return res.send(app);
	} catch (error) {
		return next(error);
	}
};
