var mongoose = require('mongoose');

const skillSchema = mongoose.Schema({
    employee_id: {
        type: String,
        required: true,
        maxlength: 100
    },
    skill_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        require: true,
    },
    years_of_experiance: {
        type: Number,
        required: true
    }
});

const skillData = mongoose.model("userSkill", skillSchema);
module.exports = skillData;