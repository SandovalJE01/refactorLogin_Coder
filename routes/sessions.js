import Router from "express";

import UsersDAO from "../daos/users.dao.js";

const router = Router()

router.post("/register", async (req, res) => {

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let age = parseInt(req.body.age);
    let password = req.body.password;

    if(!first_name || !last_name || !email || !age || !password){
        res.redirect("/register");
    }

    let emailUsed = await UsersDAO.getUserByEmail(email);

    if(emailUsed){
        res.redirect("/register");
    } else {
        await UsersDAO.insert(first_name,last_name,age,email,password);
        res.redirect("/login");
    }

})

router.post("/login", async (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password){
        res.redirect("/login");
    }

    let user = await UsersDAO.getUserByCreds(email, password);

    if(!user){
        res.redirect("/login");
    } else {
        req.session.user = user._id;
        if (user.role === "admin"){
            req.session.isAdmin = true;
            res.redirect("/panel-administracion");
        } else {
            req.session.isAdmin = false;
            res.redirect("/products");
        }
    }

})

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/login");
    })
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/products",
    failureRedirect: "/login", 
    failureFlash: true
}));

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }, 
    async(req, res)=>{
    }
));

router.get(
    "/github/callback",
    passport.authenticate("github", {
        failureRedirect: "/login",
    }),
    async(req, res)=>{
        req.session.user = req.user;
        res.redirect("/products")
    }
);

export default router;