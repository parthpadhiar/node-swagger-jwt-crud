const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Library API",
      version: '1.0.0',
    },
  },
  apis: ["app.js"],
};


const db = require('./config/config').get(process.env.NODE_ENV);
const {
  auth
} = require('./middlewares/auth');
const userController = require('./controllers/user.controller')
const skillController = require('./controllers/skills.controller')

const app = express();
// app use
app.use(bodyparser.urlencoded({
  extended: false
}));
app.use(bodyparser.json());
app.use(cookieParser());

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(db.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err) {
  if (err) console.log(err);
  console.log("database is connected");
});


const HOME = '/home';
const REGISTER = '/api/register';
const LOGIN = '/api/login';
const PROFILE = '/api/profile';
const LOGOUT = '/api/logout';
const EDIT_USER_DETAILS = '/api/profile/edit';
const DELETE_USER = '/api/profile/delete';

const ADD_SKILLS = '/api/profile/add_skills';
const SHOW_SKILLS = '/api/profile/show_skills';
const EDIT_USER_SKILL = '/api/profile/skills/edit';

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/**
 * @swagger
 * /home:
 *   get:
 *     description: Home Page
 *     responses:
 *       200:
 *         description: Success
 * 
 */
app.get(HOME, userController.home);


/**
 * @swagger
 * /api/register:
 *   post:
 *     description: Registration
 *     parameters:
 *      - name: name
 *        description: name
 *        in: formData
 *        required: true
 *        type: string
 * 
 *      - name: userName
 *        description: userName
 *        in: formData
 *        required: true
 *        type: string
 * 
 *      - name: phone
 *        description: phone Number
 *        in: formData
 *        required: true
 *        type: number
 * 
 *      - name: gender
 *        description: gender
 *        in: formData
 *        required: true
 *        type: string
 * 
 *      - name: email
 *        description: email
 *        in: formData
 *        required: true
 *        type: string
 * 
 *      - name: password
 *        description: password
 *        in: formData
 *        required: true
 *        type: string
 * 
 *      - name: password2
 *        description: comfirm password
 *        in: formData
 *        required: true
 *        type: string
 *     responses:
 *       201:
 *         description: Created
 */
app.post(REGISTER, userController.register)

/**
 * @swagger
 * /api/login:
 *   post:
 *     description: Registration
 *     parameters: 
 *      - name: email
 *        in: formData
 *        description: email
 *        required: true
 *        type: string
 * 
 *      - name: password
 *        in: formData
 *        description: password
 *        required: true
 *        type: string
 *     responses:
 *       201:
 *         description: Created
 */
app.post(LOGIN, userController.login);

/**
 * @swagger
 * /api/profile:
 *   get:
 *     description: User Profile
 *     responses:
 *       200:
 *         description: Success
 * 
 */
app.get(PROFILE, auth, userController.profile);

/**
 * @swagger
 * /api/profile/edit:
 *   post:
 *     description: Edit User
 *     parameters:
 *      - name: name
 *        description: name
 *        in: formData
 *        required: true
 *        type: string
 * 
 *      - name: userName
 *        description: userName
 *        in: formData
 *        required: true
 *        type: string
 * 
 *      - name: phone
 *        description: phone Number
 *        in: formData
 *        required: true
 *        type: number
 * 
 *      - name: gender
 *        description: gender
 *        in: formData
 *        required: true
 *        type: string
 *     responses:
 *       201:
 *         description: Created
 */
app.post(EDIT_USER_DETAILS, auth, userController.editProfile)


/**
 * @swagger
 * /api/profile/delete:
 *   post:
 *     description: Delete User
 *     responses:
 *       201:
 *         description: Created
 */

// delete the logged in user so in swagger there is nothing to pass
app.post(DELETE_USER, auth, userController.deleteUser)

/**
 * @swagger
 * /api/logout:
 *   get:
 *     description: User Logout
 *     responses:
 *       200:
 *         description: Successfully logout
 * 
 */
app.get(LOGOUT, auth, userController.logout);

/**
 * @swagger
 * /api/profile/add_skills:
 *   post:
 *     description: Add skill
 *     parameters:
 *      - name: skill_name
 *        description: name
 *        in: formData
 *        required: true
 *        type: string
 * 
 *      - name: description
 *        description: userName
 *        in: formData
 *        required: true
 *        type: string
 * 
 *      - name: years_of_experiance
 *        description: phone Number
 *        in: formData
 *        required: true
 *        type: number
 *     responses:
 *       201:
 *         description: Created
 */
// match employee_id
app.post(ADD_SKILLS, auth, skillController.addSkills)

/**
 * @swagger
 * /api/profile/show_skills:
 *   get:
 *     description: Show skills
 *     responses:
 *       200:
 *         description: Success
 * 
 */
app.get(SHOW_SKILLS, auth, skillController.showSkills)


/**
 * @swagger
 * /api/profile/skills/edit:
 *   post:
 *     description: Edit skill
 *     parameters:
 *      - name: skill_name
 *        description: name
 *        in: formData
 *        required: true
 *        type: string
 * 
 *      - name: description
 *        description: userName
 *        in: formData
 *        required: true
 *        type: string
 * 
 *      - name: years_of_experiance
 *        description: phone Number
 *        in: formData
 *        required: true
 *        type: number
 *     responses:
 *       201:
 *         description: Created
 */
app.post(EDIT_USER_SKILL, auth, skillController.editSkills)

// listening port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is live at ${PORT}`);
});