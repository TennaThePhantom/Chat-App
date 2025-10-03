import { Request } from "express";

// express doesn't have a built-in user property on the Request interface to handle authenticated users
// this check if it can be a type of string, symbol, object, undefined, unknown before defaulting to any(any always works but not ideal)
export default interface AuthenticatedRequest extends Request {
	user?: string | symbol | object | undefined | unknown | any;
}
