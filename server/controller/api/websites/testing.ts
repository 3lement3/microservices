import { Request, Response, NextFunction } from "express";

// https://github.com/luin/ioredis/blob/HEAD/examples/ttl.js
// https://github.com/luin/ioredis
// import redis from "../../../../custom/helpers/serverCache.js";
// By default, it will connect to localhost:6379.
import microserviceCall from "../../../../custom/helpers/microserviceCall.js";

export const test = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		/* await redis.mset({ k1: "v1", k2: "v2" });
		let redisGet = await redis.get("testkey");
		let returnValue = { getV: redisGet, setV: undefined };
		let redisSet: any;
		if (!redisGet) {
			redisSet = await redis.set("testkey", "testvalue");
			returnValue.getV = await redis.get("testkey");
		}
		returnValue.setV = redisSet;

		return res.send(returnValue); */

		let service = await microserviceCall({
			microservice: "globalData",
			path: "/api/testing/",
		});
		return res.send(service);
	} catch (error) {
		return next(error);
	}
};
