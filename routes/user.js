const express= require('express');
const router= express.Router();
const User= require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');

//signup
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let{username, email, password}= req.body;
        const newUser= new User({email, username});
        const registeredUser =await User.register(newUser, password);
        console.log("Registered user Details:" ,registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        });
        
    }
    catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }


}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

//login
//Passport provides an authenticate() function, which is used as route middleware to authenticate requests.
//  Fix: Post-Login Redirection is on the right track
router.post("/login",saveRedirectUrl, passport.authenticate('local', {failureRedirect: '/login', failureFlash:true }), async(req,res)=>{
    
    req.flash("success","login successfull, Welcome to wanderLust!");
    // Fix: Use the value from res.locals or fallback to /listings
    let redirectUrl= res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

});

//logout 
router.get("/logout", (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success", "You are logged out now!");
        res.redirect("/listings");
    });
});

module.exports= router;