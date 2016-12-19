var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/redditclone', ['Articles']);


router.get('/articles', function(req, res, next){
    console.log("Getting articles");
    db.Articles.find(function(err, Articles){
        if(err){
            res.send(err);
        }
        else{
            res.json(Articles);
        }
    });
});

/* GET One Todo with the provided ID */
router.get('/article/:id', function(req, res, next) {
    db.Articles.findOne({
        _id: mongojs.ObjectId(req.params.id)
    }, function(err, article) {
        if (err) {
            res.send(err);
        } else {
            res.json(article);
        }
    });
});

router.get('/article/:id', function(req, res, next){
    console.log("Getting article");
    db.Articles.find(function(err, Articles){
        if(err){
            res.send(err);
        }
        else{
            res.json(Articles);
        }
    });
});


router.post('/article', function(req, res, next){
    var article = req.body;
    article.votes = 0;
    console.log(article);
    if(!article.title || !article.link || !article.detail){
        res.status(400);
        res.json({
            "Error": "Invalid Data"
        });
    }
    else{
        db.Articles.save(article, function(err, result){
            if(err){
                res.send(err);
            }
            else{
                res.json(result);
            }
        })
    }
});

router.put('/article/:id', function(req, res, next){
    console.log("In router put");
    var article = req.body;
    var updObj = {};

    if(article.votes){
        updObj.votes = article.votes;
        console.log("Article votes in server: "+updObj.votes);
    }
    if(article.title){
        updObj.title = article.title;
    }
    if(article.link){
        updObj.link = article.link;
    }
    if(article.detail){
        updObj.detail = article.detail;
    }
    if(!updObj){
        res.status(400);
        res.json({
            "Error": "Invalid Data"
        });
    }
    else{
        db.Articles.update({
            _id: mongojs.ObjectId(req.params.id)
        }, updObj, {}, function(err, result){
            if(err){
                res.send(err);
            }
            else{
                res.json(result);
            }
        });
    }
});

router.delete('/article/:id', function(req, res){
    db.Articles.remove({
        _id:mongojs.ObjectId(req.params.id)
    }, '', function(err, result){
        if(err){
            res.send(err);
        }
        else{
            res.json(result);
        }
    });
});

module.exports = router;