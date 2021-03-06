import { Response, Router } from "express";
import { body, oneOf, param } from "express-validator/check";
import { join } from "path";
import { Observable } from "rxjs";
import { UserPosition } from "../../../models/v1/users";
import { FileManager } from "../../../repositories/FileManager";
import { User } from "../../../repositories/Users";
import { userProfile } from "../util/fileHandler";
import { authenticateRequest, authorizeRequestWithPosition, completionHandler, errorHandler, validateFile, validateRequest } from "../util/requestValidator";

export const router = Router();

router.get(
    "/position",
    authenticateRequest,
    (req, res) => {
        User
            .getInstance()
            .getPosition(req.user.id)
            .subscribe(
                (position) => res.status(200).send({ position }),
                errorHandler(res),
        );
    },
);

router.get(
    "/position/:userID",
    authenticateRequest,
    param("userID").isInt(),
    validateRequest,
    (req, res) => {
        User
            .getInstance()
            .getPosition(req.params.userID)
            .subscribe(
                (position) => res.status(200).send({ position }),
                errorHandler(res),
        );
    },
);

router.get(
    "/profile/:userID",
    authenticateRequest,
    param("userID").isInt(),
    validateRequest,
    (req, res) => {
        downloadProfile(res, req.params.id);
    },
);

router.get(
    "/profile",
    authenticateRequest,
    (req, res) => {
        downloadProfile(res, req.user.id);
    },
);

router.get(
    "/:userID",
    authenticateRequest,
    param("userID").isInt(),
    (req, res) => {
        User
            .getInstance()
            .getUserInfo(req.params.userID)
            .subscribe(
                (info) => res.status(200).send({ info }),
                errorHandler,
        );
    },
);

router.get(
    "/",
    authenticateRequest,
    (req, res) => {
        User
            .getInstance()
            .getUserInfo(req.user.id)
            .subscribe(
                (info) => res.status(200).send({ info }),
                errorHandler(res),
        );
    },
);

router.post(
    "/upload/:userID",
    authenticateRequest,
    userProfile,
    validateFile,
    param("userID").isInt(),
    validateRequest,
    (req, res) => {
        FileManager
            .getInstance()
            .uploadProfile(req.params.userID, req.file)
            .subscribe(completionHandler(res));
    },
);

router.post(
    "/addStudent",
    authorizeRequestWithPosition(UserPosition.admin, UserPosition.dev, UserPosition.mel),
    body("nextStudentID").isInt(),
    (req, res) => {
        let observable: Observable<string>;
        if (req.body.nextStudentID) {
            observable = User.getInstance().createStudent(req.body.nextStudentID);
        } else {
            observable = User.getInstance().generateStudent();
        }
        observable
            .subscribe(
                (password) => res.status(200).send({ password }),
                errorHandler(res),
        );
    },
);

router.patch(
    "/:userID",
    authenticateRequest,
    param("userID").isInt(),
    oneOf([
        body("firstname").isString(),
        body("lastname").isString(),
        body("nickname").isString(),
        body("firstnameEn").isString(),
        body("lastnameEn").isString(),
        body("nicknameEn").isString(),
        body("email").isEmail(),
        body("phone").isMobilePhone("th-TH"),
        body("password").isString(),
    ]),
    (req, res) => {
        User.getInstance().edit(
            req.params.userID,
            {
                Email: req.body.email,
                Firstname: req.body.firstname,
                FirstnameEn: req.body.firstnameEn,
                Lastname: req.body.lastname,
                LastnameEn: req.body.lastnameEn,
                Nickname: req.body.nickname,
                NicknameEn: req.body.nicknameEn,
                Phone: req.body.phone,
                UserPassword: req.body.password,
            },
        ).subscribe(completionHandler(res));
    },
);

function downloadProfile(res: Response, userID: number) {
    let imagePath: string;
    FileManager
        .getInstance()
        .downloadProfile(userID)
        .subscribe(
            (path) => {
                imagePath = join(__dirname, "../../../../", path);
                res.sendFile(imagePath);
            },
            errorHandler(res),
            () => FileManager.cleanUp(res, imagePath),
    );
}

// router.post(
//     "/register",
//     authorizeRequestWithPosition(UserPosition.student, UserPosition.admin, UserPosition.dev, UserPosition.mel),
//     body("userID").isInt(),
//     body("firstname").isString(),
//     body("lastname").isString(),
//     body("nickname").isString(),
//     body("firstnameEn").isString(),
//     body("lastnameEn").isString(),
//     body("nicknameEn").isString(),
//     body("email").isEmail(),
//     body("phone").isMobilePhone("th-TH"),
//     body("grade").isInt({ min: 1, max: 12 }),
//     body("quarterID").isInt(),
//     validateRequest,
//     (req, res) => {

//     },
// );

// router.post(
//     '/register',
//     validateUserPosition('student', 'admin', 'dev', 'mel'),
//     body('userID').isInt(),
//     body('firstName').isString(),
//     body('lastname').isString(),
//     body('nickname').isString(),
//     body('firstnameEn').isString(),
//     body('lastnameEn').isString(),
//     body('nicknameEn').isString(),
//     body('email').isEmail(),
//     body('phone').isMobilePhone('th-TH'),
//     body('grade').isInt({ min: 1, max: 12 }),
//     body('quarterID').isInt(),
//     validateRequest,
//     (req, res) => {
//         User.getInstance().registerStudent(
//             req.body.userID,
//             req.body.firstName,
//             req.body.lastname,
//             req.body.nickname,
//             req.body.firstnameEn,
//             req.body.lastnameEn,
//             req.body.nicknameEn,
//             req.body.email,
//             req.body.phone,
//             req.body.grade,
//             req.body.quarterID,
//         ).subscribe(
//             completionHandler(res),
//         );
//     },
// );
