const Express=require('express');
const ExpressHandlebars=require('express-handlebars');
const Session=require('express-session');
const Passport=require('passport');

const Config=require('./lib/Config.js');
const SessionPassport=require('./src/passportConfig.js');
const Handlers=require('./src/handlers.js')

const port =Config.Port||3000;
const app= Express();

//handlebars step
app.engine('handlebars',ExpressHandlebars({
    defaultLayout:'main',
    helpers:{
        //add code in view section to layout 
        section :function(name ,options){
            //init array to hold saction name
            if(!this._sections) this._sections={};

            this._sections[name]=options.fn(this);
            return null;
        }}
}));
app.set('view engine','handlebars');

//app step
app.use(Express.json());
app.use(Express.urlencoded({extended:true}));
app.use(Express.static(__dirname + '/public'));


//session and passport step
SessionPassport.initialize(app,Passport,Session)

//
app.get('/', Handlers.api.checkNotAuthenticated,Handlers.home)
app.get('/users/login', Handlers.api.checkAuthenticated, Handlers.login)
app.get('/users/register', Handlers.register)


//
app.post("/users/login", Passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: false
    }));
app.post('/users/register', Handlers.api.register);


app.listen(port,()=>console.log(`Express started on http://localhost:${port};\npress Ctrl-C to terminate.`))