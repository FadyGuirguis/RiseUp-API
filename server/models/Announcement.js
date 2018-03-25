var mongoose = require('mongoose');

const AnnouncementSchema = mongoose.Schema({

    title: {
        type: String,
        require: true
    },

    description: {
        type: String,
        require: true,
        default: ''
    }

});

mongoose.model('Announcement', AnnouncementSchema);