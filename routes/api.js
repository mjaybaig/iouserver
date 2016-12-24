var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
// var db = mongojs('mongodb://localhost:27017/iou', ['users']);
var db = mongojs('mongodb://admin:baig5275@ds139198.mlab.com:39198/iou', ['users']);

// router.get('/articles', function(req, res, next){
//     console.log("Getting articles");
//     db.Articles.find(function(err, Articles){
//         if(err){
//             res.send(err);
//         }
//         else{
//             res.json(Articles);
//         }
//     });
// });

/* GET all debts owed to/from specified user */
router.get('/mydebts/:tofrom/:id', function(req, res, next) {
    db.users.findOne({
        _id: mongojs.ObjectId(req.params.id)
    }, function(err, user) {
        if (err) {
            res.send(err);
        } else {
            //if client requested for all debts owed to username
            if(req.params.tofrom == 'to'){
                res.json(user.owedtome);
            }
            //if client requested for all debts owed from username
            else if(req.params.tofrom == 'from'){
                res.json(user.owedbyme);
            }
            else{
                res.sendStatus(404);
            }
        }
    });
});


// router.get('/article/:id', function(req, res, next){
//     console.log("Getting article");
//     db.Articles.find(function(err, Articles){
//         if(err){
//             res.send(err);
//         }
//         else{
//             res.json(Articles);
//         }
//     });
// });


// router.post('/mydebts/:tofrom/:id', function(req, res, next){
//     var debt = req.body;
//     article.votes = 0;
//     console.log(article);
//     if(!article.title || !article.link || !article.detail){
//         res.status(400);
//         res.json({
//             "Error": "Invalid Data"
//         });
//     }
//     else{
//         db.Articles.save(article, function(err, result){
//             if(err){
//                 res.send(err);
//             }
//             else{
//                 res.json(result);
//             }
//         })
//     }
// });

//Add a new debt to a particular user

router.put('/mydebts/:tofrom/:id', function(req, res, next){
    console.log("In router put: "+req.params.id);
    var debt = req.body;
    var updObj = {};

    // if(debt.owedby){
    //     updObj.owedby =debt.owedby;
    //     console.log("debt name in server: "+debt.owedby);
    // }
    if(debt.name){
        updObj.owedby = debt.name;
    }
    if(debt.amount){
        updObj.amount = debt.amount;
    }
    if(!updObj){
        res.status(400);
        res.json({
            "Error": "Invalid Data"
        });
    }
    else{
        updObj.isClosed = false;
        if(req.params.tofrom == 'to')
        {
            db.users.update(
                { _id: mongojs.ObjectId(req.params.id)},
                { $push: {'owedtome': updObj} },
                {},
                function(err, result){
                    if(err){
                        res.send(err);
                    }
                    else{
                        res.json(result);
                    }
                }
            );
        }
        else if(req.params.tofrom=='from')
        {
            db.users.update({
                  _id: mongojs.ObjectId(req.params.id)
            }, { $push: {'owedbyme': updObj}}, {}, function(err, result){
                if(err){
                    res.send(err);
                }
                else{
                    res.json(result);
                }
            });
        }
    }
});


//close a particular debt on a specified user
router.put('/closedebt/:tofrom/:id', function(req, res, next){
    console.log("In router putty: "+req.params.id);
    var index = req.body.index;

    //increasing index because stupid if statement treats 0 value as null

    // if(debt.owedby){
    //     updObj.owedby =debt.owedby;
    //     console.log("debt name in server: "+debt.owedby);
    // }
    console.log(index);
    if(index === null){
        res.status(400);
        res.json({
            "Error": "Invalid Data"
        });
    }
    else{
        if(req.params.tofrom == 'to')
        {
            var key = index;
            var value = true;

            var placeholder = {};
            placeholder['owedtome.' + key+'.isClosed'] = value;

            db.users.update(
                { _id: mongojs.ObjectId(req.params.id)},
                { $set:placeholder},
                {},
                function(err, result){
                    if(err){
                        res.send(err);
                    }
                    else{
                        console.log(result);
                        res.json(result);
                    }
                }
            );
        }
        else if(req.params.tofrom=='from')
        {
            db.users.update({
                  _id: mongojs.ObjectId(req.params.id)
            }, { $push: {'owedbyme': updObj}}, {}, function(err, result){
                if(err){
                    res.send(err);
                }
                else{
                    res.json(result);
                }
            });
        }
    }
});


// router.delete('/article/:id', function(req, res){
//     db.Articles.remove({
//         _id:mongojs.ObjectId(req.params.id)
//     }, '', function(err, result){
//         if(err){
//             res.send(err);
//         }
//         else{
//             res.json(result);
//         }
//     });
// });

module.exports = router;
