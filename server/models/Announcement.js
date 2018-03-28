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
