/**
 * @desc 将所有自己的接口的acceptJson设置为true
 */

export default () => {

    return async function robben(ctx, next) {

        ctx.type = 'json';

        const METHOD: string = ctx.request.method;

        if (METHOD === 'POST') {
            ctx.status = 201;
        } else if (METHOD === 'PUT') {
            ctx.status = 201;
        } else if (METHOD === 'DELETE') {
            ctx.status = 204;
        }
        await next();

        if (ctx.request.url.match('/pc/')) {
            ctx.body = {
                data: Object.assign({}, ctx.body),
                success: true,
            };
        }
    };
};
