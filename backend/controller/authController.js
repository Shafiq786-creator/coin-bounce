const Joi = require('joi');
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const userDto = require('../dto/user');
const UserDTO = require('../dto/user');
const JWTService = require('../services/JWTservice');
const RefreshToken = require('../models/token');

const passwordPattern =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,25}$/


const authController = {
                  //register router

    async register(req, res, next) {
        //1. validate userinput
        const userRegisterSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            name: Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref('password')
        })

        const {error} = userRegisterSchema.validate(req.body);
        //2.if error in validation --> return error via middleware
        if(error){
            return next(error);
        }


        //3. if email or userId already registered --> return an error
        const {username, name, email, password} = req.body;

        try{

            const emailInUse =  await User.exists({email});

            const usernameInUse =  await User.exists({username});

            if(emailInUse){
                const error = {
                    status: 409,
                    message: 'Email already registered, use another email!'
                }
                return next(error);
            }

            if(usernameInUse){
                const error = {
                    status: 409,
                    message: 'Username not available, choose another username!'
                }
                return next(error);
            }
        } catch(error){
              return next(error);
        }

        //4. password hash
      const hashPassword = await bcrypt.hash(password, 10);
        //5. store data in database

        let accessToken;
        let refreshToken;
         let user;
        try{
            const userToRegister = new User({
                name,
                username, 
                email,
                password : hashPassword
              });
                   user= await userToRegister.save();

                  //token generation
                  accessToken = JWTService.signAccessToken({_id: user._id},'30m');
                  refreshToken = JWTService.signRefreshToken({_id: user._id}, '7d');
        }
        catch(error){
             return next(error);
        }
        // store refresh token in db
      await JWTService.storeRefreshToken(refreshToken, user._id);
         
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        })

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true
        })
         
        //6.response send
    const userDto = new UserDTO(user);

    return res.status(201).json({user: userDto, auth: true});

    },
            //login router

    async login(req, res, next) {
 //1.validate user input
          const userLoginSchema = Joi.object({
            username :Joi.string().min(5).max(30).required(),
            password :Joi.string().pattern(passwordPattern)
          })

       //2.if validation error, return error
        const{error} = userLoginSchema.validate(req.body);
        if(error){
            return next(error)
        }

        //3.match username and password

          const {username, password} = req.body;
         //match username
         let user;
        try{
         user= await User. findOne({username});
        if(!user){
            const error = {
                status : 401,
                message: 'Invalid username'
            }
            return next(error);
        }
        //matic password
        const match = await bcrypt.compare(password, user.password);
          if(!match){
            const error = {
                status: 401,
                message: 'Invalid password'
            }
            return next(error)
          }

        }
          catch(error){
              return next(error);
        }
//4. return response

       const  accessToken = JWTService.signAccessToken({_id: user._id},'30m');
       const  refreshToken = JWTService.signRefreshToken({_id: user._id},'7d');

       //update refresh token in db
       try{
       await RefreshToken.updateOne({
            _id: user._id
           },
            {token: refreshToken},
            {upsert: true}
        )
       } catch(error){
        return next(error)
       }
     


       res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
       });

       res.cookie('refreshToken', refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
       });

       const userDto = new UserDTO(user);


        return res.status(200).json({user: userDto, auth: true});
        
    },
    // logout router

    async logout(req, res, next){
       const {refreshToken} = req.cookies;

       try {
        //1.delete refresh token from db
        await RefreshToken.deleteOne({token : refreshToken});
       } catch (error) {
          return next(error);
       }

       //delete cookies
       res.clearCookie('accessToken');
       res.clearCookie('refreshToken');

       //2.response 
       res.status(200).json({user: null, auth: false});
    },
    //refresh controller
    async refresh(req, res, next){
    //1. get refreshToken from cookies
    //2. verify refresh token
    //3. generate new token
    //4. update db , return response
    const originalRefreshToken = req.cookies.refreshToken;
  let id;
    try {
       id =  JWTService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
        const error = {
            status: 401,
            message: 'Unauthorized'
        }

        return next(error)
    }

    try {
        const match =  RefreshToken.findOne({_id: id, token: originalRefreshToken});

        if (!match){
            const error = { 
                status : 401,
                message: 'Unathorized'
            }
            return next(error);
        }
    } catch (e) {
        return next(e)
    }
   
    try {
        const accessToken = JWTService.signAccessToken({_id: id},'30m');

        const refreshToken = JWTService.signRefreshToken({_id: id},'7d');

       await RefreshToken.updateOne({_id:id}, {token: refreshToken});

       res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
       })

       
       res.cookie('refreshToken', refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
       })
    } catch (e) {
        return next(e);
    }
    const user = await User.findOne({_id: id});

    const userDto = new UserDTO(user);

    return res.status(200).json({user: userDto, auth: true})
    }
}

module.exports = authController;