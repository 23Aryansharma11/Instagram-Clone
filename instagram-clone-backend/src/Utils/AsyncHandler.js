const AsyncHandler=(func)=> async(req, res, next)=>{
    try {
        await func(req,res,next);

    } catch (error) {

        res.status(error.code || 500).json({
            success: flase,
            message: error.message
        });

    }
}