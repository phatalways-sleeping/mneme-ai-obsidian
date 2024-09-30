import { Handler } from "express";

const handleHealthCheck: Handler = async (req, res, next) => {
	res.json({ status: "ok" });
};

const handleGetRequest: Handler = async (req, res, next) => {
	res.json({ status: "ok" });
};

const handlePostRequest: Handler = async (req, res, next) => {
	res.status(201).json({ status: "ok" });
};

export { handleHealthCheck, handleGetRequest, handlePostRequest };
