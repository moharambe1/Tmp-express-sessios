const Pool = require('./dbConfig.js');

module.exports.home = (req, res) => {
    res.render('home',{userName:req.user.name});
};

module.exports.login = (req, res) => {
    res.render('login');
}
module.exports.register = (req, res) => {
    res.render('register')
}




module.exports.api = {
    register: async (req, res) => {
        const {
            name,
            email,
            password,
            password2
        } = req.body;
        let errors = [];
        console.log({
            name,
            email,
            password,
            password2
        });
        if (!name || !email || !password || !password2) {
            errors.push({
                message: "Please enter all fields"
            });
        }
        if (password.length < 6) {
            errors.push({
                message: "Password must be a least 6 characters long"
            });
        }

        if (password !== password2) {
            errors.push({
                message: "Passwords do not match"
            });
        }
        if (errors.length > 0) {
            res.render("register", {
                listError: errors
            });
        } else {
            Pool.query('SELECT * FROM users WHERE email=$1', [email], (err, results) => {
                if (err) console.log(err);
                console.log(results.rows);
                if (results.rowCount > 0) {
                    return res.render("register", {
                        listError: {
                            message: "email already registerd"
                        }
                    });
                } else {
                    Pool.query(`INSERT INTO users(name,email,password)
                                VALUES($1,$2,$3)
                                RETURNING id,password`, [name, email, password], (err, results) => {
                        if (err) throw err;
                        console.log(results.rows);
                        res.redirect("/users/login");
                    });
                }
            })
        }

    },

    checkAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect("/");
        }
        next();
    },
    checkNotAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/users/login");
    },
}