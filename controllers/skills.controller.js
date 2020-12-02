const Skill = require('../models/userSkill.model');

exports.addSkills = async (req, res) => {
    try {
        const {
            skill_name,
            description,
            years_of_experiance
        } = req.body;
        const add_skill = new Skill({
            employee_id: req.user._id,
            skill_name: skill_name,
            description: description,
            years_of_experiance: years_of_experiance
        });
        await add_skill.save();
        console.log('ADD_SKILLS --->', add_skill);
        return res.send(add_skill);
    } catch (error) {
        console.log('Error: ', error);
    }
}

exports.showSkills = async (req, res) => {
    try {
        const user_id = req.user._id;
        await Skill.find({
            "employee_id": user_id
        }, (err, data) => {
            if (!err) {
                console.log(data);
                res.send(data)
            } else {
                log.info(err)
            }
        });
    } catch (error) {
        console.log('Error: ', error);
    }
}

exports.editSkills = (req, res) => {
    try {
        const user_id = (req.user._id);
        console.log(user_id);
        Skill.update({
            employee_id: user_id
        }, {
            "$set": {
                "skill_name": req.body.skill_name,
                "description": req.body.description,
                "years_of_experiance": req.body.years_of_experiance
            }
        }, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Updated");
                return res.send("updated")
            }
        })
    } catch (error) {
        console.log('Error: ', error);
    }
}