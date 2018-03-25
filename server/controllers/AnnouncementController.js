const mongoose = require('mongoose');
Announcement = mongoose.model('Announcement');

// GET /announcements
module.exports.getAllAnnouncements = async (req, res) => {

    res.send({
        message: 'Hello Shadi'
    });

};

// [TODO] POST /announcements
module.exports.postAnnouncement = async (req, res) => {

    res.send({
        message: 'Hello Shadi'
    });

};