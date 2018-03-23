var express = require('express');
var router = express.Router();

var verifyRounter = require('./Verify/verify');
var monk = require('monk');
var db = monk('localhost:27017/WHUSE');
var colloction = db.get('user');

router.use('/verify', verifyRounter);

router.get('/', function (req, res, next) {//select
    colloction.find({ name: req.headers.name, password: req.headers.password }, function (err, result) {
        if (err) throw err;
        if (result)
            if (result.length == 1) {
                res.send({ valid: '1' });
            }
            else
                res.send({ 'valid': '0' });
    });
    return;
}
);

router.post('/', function (req, res, next) {//add
    colloction.insert({ name: req.body.name, password: req.body.password }, function (err, result) {
        if (err)
            if (err.code == 11000)
                res.send({ 'succeed': '0', 'error': 'duplicated name' });
            else
                res.send({ 'succeed': '0', 'error': 'unkonwn' });
        else
            res.send({ succeed: '1' })

        return;
    });
    return;
});

router.put('/', function (req, res, next) {//update
    colloction.update({ name: req.body.name, password: req.body.password }, JSON.parse(req.body.content), function (err, result) {
        console.log(result);
        if (err)
            if (err.code == 11000)
                res.send({ succeed: '0', error: 'duplicated name' });
            else
                res.send({ succeed: '0', error: 'unkonwn' });
        else if (result.n > 0)
            res.send({ succeed: '1' });
        else
            res.send({ succeed: '0', error: 'invalid password' });
        return;
    }
    );
    return;
});

router.delete('/', function (req, res, next) {//delete
    colloction.remove({ name: req.body.name, password: req.body.password }, function (err, result) {
        if (err) {
            res.send({ succeed: '0', error: 'unknown' });
            return;
        }

        res.send({ succeed: '1' });
    });
    return
});


module.exports = router;