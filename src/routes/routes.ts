import { Router , Request,Response} from "express";

import { routePrivate } from "../middlewares/Auth";

import * as AuthValidator from "../validators/AuthValidator"
import * as UserValidator from "../validators/UserValidator"

import * as AuthController  from "../controllers/AuthController"
import * as AdsController  from "../controllers/AdsController"
import * as UserController  from "../controllers/UserController"


const router = Router()

router.get('/ping', (req : Request, res : Response) => {
    res.json({pong: true})
})

router.get('/states', UserController.getStates);

router.post('/user/signin',AuthValidator.signin, AuthController.signin);
router.post('/user/signup',AuthValidator.signup, AuthController.signup);

router.get('/user/me',routePrivate, UserController.info);
router.put('/user/me',UserValidator.editAction, routePrivate, UserController.editAction);

router.get('/categories', AdsController.getCategories);

router.post("/ad/add", routePrivate , AdsController.addAction);
router.get("/ad/list",AdsController.getList);
router.get("/ad/:id",AdsController.getItem);
router.post("/ad/:id", routePrivate , AdsController.editAction);


export default router


