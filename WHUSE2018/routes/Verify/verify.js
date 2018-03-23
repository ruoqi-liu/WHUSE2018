var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/WHUSE');


router.use(function (req, res, next) {//format verify
    if (0) {
        res.send('incorrect account');
        return;
    }

    next();
});


router.get('/duplicate', function (req, res, next) {//duplicated
    var collection = db.get('user');
    collection.findOne({ name: req.body.name }, function (err, user) {
        if (user==null) {
            res.send({ nameExist: '1' });
            return;
        }
        else
            res.send({nameExist:'0'});
    }
)
});

module.exports = router;
