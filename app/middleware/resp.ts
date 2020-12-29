'use strict';
import { Context } from 'egg';

export default () => {
    return async function resp(ctx: Context, next) {
        ctx.response.type = 'application/json';
        await next();
        if (ctx.status >= 200 && ctx.status < 300) {
            ctx.body = {
                success: true,
                code: ctx.status,
                msg: 'success',
                data: ctx.body,
            };
        }
    };
};
