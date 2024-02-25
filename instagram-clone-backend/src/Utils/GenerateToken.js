const generateAccessTokenAndRefreshToken = async (user)=>{
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        await user.save({validateBeforeSave:false}); 
        return {accessToken, refreshToken};
    } catch (error) {
        console.log(error)
        throw new ApiError(500,"Internal Server Error. Something went wrong while generating tokens");
    }
};

export default generateAccessTokenAndRefreshToken;