import passport from "passport";
import bcrypt from "bcrypt";
import LocalStrategy from "passport-local";
import GitHubStrategy from "passport-github2";
import UsersDAO from "../daos/users.dao.js";

const initializePassport = () => {
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv23li4Xww0vDlKGzpbR',
        clientSecret: '065207fcb38b35a060a1b6036d921ff5c516e658',
        callbackURL: "http://127.0.0.1:3000/api/sessions/github/callback"
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile); // Es recomendable hacer console.log de toda la información que viene del perfil.
  
        // Busca al usuario en la base de datos por su email
        let user = await UsersDAO.getUserByEmail(profile._json.email);
  
        if (!user) { // El usuario no existía en nuestro sitio web, lo agregamos a la base de datos.
          let newUser = {
            first_name: profile._json.name,
            last_name: '', // Nota cómo nos toca rellenar los datos que no vienen desde el perfil
            age: 18, // Nota cómo nos toca rellenar los datos que no vienen desde el perfil
            email: profile._json.email,
            password: '', // Al ser autenticación de terceros, no podemos asignar un password
          };
          
          // Inserta el nuevo usuario en la base de datos
          let result = await UsersDAO.insert(newUser.first_name, newUser.last_name, newUser.age, newUser.email, newUser.password);
          done(null, result);
        } else { // Si entra aquí, es porque el usuario ya existía.
            done(null, user);
        }
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }));
  };

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  
  export default initializePassport;