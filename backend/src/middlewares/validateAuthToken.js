import jsonwebtoken from 'jsonwebtoken';

import { config } from '../config.js';

export const validateAuthToken = (allowedUserTypes = []) => {
    return (req,res,next) => {
        try {
            
            //extract the token from the cookies

            const {authToken} = req.cookies;

            //check if the cookies exists

            if(!authToken){
                return res.json({message:'Unauthorized access , login to continue'});
            }

            //extract the token information from the cookies

            const decoded = jsonwebtoken.verify(authToken, config.JWT.secret);

            req.user = decoded;

            //check if the user type is allowed to access the route

            if(!allowedUserTypes.includes(decoded.userType)){
                return res.json({message:'Unauthorized access '});
            }

            next();
        } catch (error) {
            console.log("error" + error);
            
        }

    }
    
}

