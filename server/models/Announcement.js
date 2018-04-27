/*

FILENAME: Announcement.js

DESCRIPTION:    This file specifies the Mongo Database Schema for an "Announcement" document,
                and exports its Model for use in other javascript files.

AUTHOR: Shadi Barghash
START DATE: 27-March-2018

*/

const mongoose = require('mongoose');

const AnnouncementSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true,
        default: ''
    }

});

mongoose.model('Announcement', AnnouncementSchema);
