const verboseErors = async(ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.error(err)
        ctx.status = err.status || 500;
        ctx.body = err;
        ctx.app.emit('error', err, ctx);
    }
}

module.exports = verboseErors