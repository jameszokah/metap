const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use(session({
    secret: 'key to session',
    resave: true,
    saveUninitialized: true,
}));

let peerID = null;
router.get('/', (req, res) => {
    const meetingID = uuidv4();
    req.session.meetingID = meetingID;
    peerID = meetingID;
    res.render('join', {
        title: 'Join Meeting',
        meetingID
    })
});



router.post('/room/:meetID', (req, res) => {
    const { room, user } = req.body;
    const meeting_id = req.params.meetID;
    req.session.room = room;
    req.session.user = user;
    req.session.url = req.url;

    let allUsers = [];

    allUsers.push({name: user,
        profile: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80'
    })

    console.log(allUsers)

    if (!(user && room)) {
        res.redirect('/');
        return;
    }
    res.render('room', {
        meeting_id,
        room: req.session.room,
        user: req.session.user,
        allUsers
    });

    

    console.log(req.session.room,
        req.session.user, meeting_id)
   // console.log(req.session.url)
})


router.get('/room/:meetID', (req, res) => { 
    const meetID = req.params.meetID;
    if (req.url) res.redirect('/');
})

router.post('/leave', (req,res) => {
    console.log(req.body);
    req.session.name = req.body.name
    //res.render('leave', {name: req.body.name});
    res.json({status: 'success',redirect: '/leave'})
})

router.get('/leave', (req,res) => {
    res.render('leave', {
        title: 'Leaving Meeting',
        name: req.session.name
    });
    
})
// router.use((req, res) => {
//     res.send('<h1>PAGE NOT FOUND...</h1>')
//         .send(`<h2>SORRY!! ${req.url} is not a valid url</h2>`)
//         .end();

// })

module.exports = {
    peerID,
    router
}