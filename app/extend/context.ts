
// import { Context } from 'egg';
export interface ErrorModel {
    message: string;
    code: string;
    field?: string | undefined;
}

/**
 * Context 类拓展
 */

// Http 参数校验错误  400
class BadRequest extends Error {
    public readonly status: number;
    public readonly data: any;
    public readonly name: string;
    constructor(message: string, data = {}) {
        super(message);
        this.status = 400;
        this.data = data;
        this.name = 'BadRequest';
    }
}
// Http 鉴权失败  401
class AuthFail extends Error {
    public readonly status: number;
    public readonly data: any;
    public readonly name: string;
    constructor(message: string, data = {}) {
        super(message);
        this.status = 401;
        this.data = data;
        this.name = 'Unauthorized';
    }
}
// Http 鉴权成功，无权限  403
class Forbidden extends Error {
    public readonly status: number;
    public readonly data: any;
    public readonly name: string;
    constructor(message: string, data = {}) {
        super(message);
        this.status = 403;
        this.data = data;
        this.name = 'Forbidden';
    }
}
// Http 服务器内部错误，例如数据库查询失败等  500
class InternalServerError extends Error {
    public readonly status: number;
    public readonly data: any;
    public readonly name: string;
    constructor(message: string, data = {}) {
        super(message);
        this.status = 500;
        this.data = data;
        this.name = 'InternalServerError';
    }
}

class CommonError extends Error {
    public readonly status: number;
    public readonly data: any;
    public readonly name: string;
    constructor(message: string, data = {}, status: number, name: string) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = name;
    }
}

export default {
    get HttpError() {
        return {
            BadRequest,
            AuthFail,
            Forbidden,
            InternalServerError,
            CommonError,
        };
    },
    /**
     * 覆写 egg-validate 的 validate，目的是为了使用自定义的异常名称 [ 可以在这里拓展下错误信息的自定义 ]
     */
    // validate(this: Context, rules: object, data?: object) {
    //     data = data || this.request.body;
    //     const errors = this.app.validator.validate(rules, data);
    //     if (errors) {
    //         const err: ErrorModel = errors[0];
    //         throw new BadRequest(`参数异常: ${err.field} ${err.message} `, errors[0]);
    //     }
    // }
};
