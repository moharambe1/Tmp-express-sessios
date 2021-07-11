const LocalStorge = require('passport-local').Strategy;

const Config =require('../lib/Config.js')
const Pool = require('./dbConfig.js');

function initialize(app, passport, session) {
    
    console.log("Initialized");
    //passport init
    const authonticateUser = (email, password, done) => {
        console.log(email, password);
        Pool.query(`SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
            if (err) throw err;
            console.log("verfiy function");
            if (results.rowCount > 0) {
                const user = results.rows[0];
                if (user.password == password) {
                    return done(null, user);
                } else 
                    return done(null, false, {message: "Password is incorrect"});
                
            } else 
                return done(null, false, {message: "No user with that email address"});
            
        });
    };
    passport.use(new LocalStorge({usernameField:"email",passwordField:"password"},authonticateUser))
    //what store in sission 
    passport.serializeUser((user,done)=>{return done(null,user.id)});
    //what put in requst data
    passport.deserializeUser((id,done)=>{
        Pool.query('SELECT * From users WHERE id =$1',[id],(err,results)=>{
            if(err) done(err);
            console.log(`ID is ${results.rows[0].id}`);
            return done(null,results.rows[0]);
        });
    });
    const pgSession = require('connect-pg-simple')(session)

    app.use(session({
        secret:'keyboard cxat',
        resave:false,
        saveUninitialized:false,
        store:new pgSession({
            pool:Pool,
            tableName:'session'
        }),
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: false
        }
    }));
    app.use(passport.initialize())
    app.use(passport.session());
}

module.exports={initialize};