/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = debugLog;


function debugLog(s) {
    // console.log(s);
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = globalBus;


const GLOBAL_BUS = {
    saver: {
        userOrg: []
    }
};

function globalBus() {
    return GLOBAL_BUS;
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__globalBus__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__debugLog__ = __webpack_require__(0);
/**
 * Класс для запросов на сервер
 */





const messagesFromHost = {
    HTTP_OK : 2,
    XHR_READY : 4
};

const WITH_CREDENTIALS = false;

class Requester {

    /**
     * Возвращает url backend сервера
     * @returns {string}
     */
    static baseUrl() {
        // return  "https://keklik-api.herokuapp.com/";
        // return "http://46.229.213.75:8000/";
        return "http://api.keklik.xyz/"
    }

    /**
     * HTTP-запрос на сервер
     * @param {string} method - метод запроса "GET", "POST"
     * @param {string} address
     * @param {object} data
     * @param callback
     */
    static requestToHost(method = "GET", address, data = null, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, this.baseUrl() + address, true);
        xhr.withCredentials = WITH_CREDENTIALS; //for cookies

        const body = JSON.stringify(data);

        xhr.setRequestHeader("Content-Type", "application/json; charset=utf8");
        xhr.setRequestHeader("Authorization", Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().authWorker.getToken());

        if (method === "GET" || method === "DELETE") {
            xhr.send(null);
        } else {
            xhr.send(body);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== messagesFromHost.XHR_READY) {
                return;
            }
            if (parseInt(+xhr.status/100) !== messagesFromHost.HTTP_OK) {
                if (JSON.parse(xhr.responseText).message === "Invalid token.") {
                    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().authWorker.deleteToken();
                }
                Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])(xhr.status + ' from 400');
                return callback(xhr, null);
            }

            if (method !== "DELETE") {
                const response = JSON.parse(xhr.responseText);
                callback(null, response);
            } else {
                callback(null, null);
            }
        };
    }

    /**
     * Авторизация пользователя
     * @param username
     * @param password
     * @param callback
     */
    static auth(username, password, callback) {
        const user = {username, password};
        Requester.requestToHost("POST", "api/session/", user, callback);
    }

    /**
     * Регистрация пользователя
     * @param username
     * @param password
     * @param callback
     */
    static register(username, password, callback) {
        const user = {username, password};
        Requester.requestToHost("POST", "api/users/", user, callback);
    }

    /**
     * Узнает информацию о текущем пользователе
     * @param callback
     */
    static whoami(callback) {
        Requester.requestToHost("GET", "api/users/me/", null, callback);
    }

    static quizNew(quiz, callback) {
        Requester.requestToHost("POST", "api/quizzes/", quiz, callback);
    }

    static quizEdit(id, quiz, callback) {
        Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])("id = " + id);
        Requester.requestToHost("PUT", `api/quizzes/${id}/`, quiz, callback);
    }

    static quizzesAll(callback) {
        Requester.requestToHost("GET", "api/quizzes/", null, callback);
    }

    static quizzesOfUser(callback) {
        Requester.requestToHost("GET", "api/users/me/quizzes/", null, callback);
    }

    static changeUserData(last_name, email, callback) {
        const userData = {last_name, email};
        Requester.requestToHost("PATCH", "api/users/me/", userData, callback);
    }

    static changePassword(old_password, new_password, callback) {
        const data = {old_password, new_password};
        Requester.requestToHost("POST", "api/users/me/password/", data, callback);
    }

    static getQuizById(id, callback) {
        Requester.requestToHost("GET", `api/quizzes/${id}/`, null, callback);
    }

    static createGame(id, label = "", group_id, callback) {
        let quiz = null;
        if (group_id === null) {
            quiz = {
                quiz: id,
                label: label,
                online: true
            };
        } else {
            quiz = {
                quiz: id,
                label: label,
                online: true,
                group: group_id
            };
        }
        Requester.requestToHost("POST", "api/games/", quiz, callback);
    }

    static organizationsAll(callback) {
        Requester.requestToHost("GET", "api/organizations/", null, callback);
    }

    static getOrganizationsById(id, callback) {
        Requester.requestToHost("GET", `api/organizations/${id}/`, null, callback);
    }

    static getRunningGameByGroupId(id, callback) {
        Requester.requestToHost("GET", `api/groups/${id}/games/running/`, null, callback);
    }

    static getRunningGameByUser(callback) {
        Requester.requestToHost("GET", "api/games/my/running/", null, callback);
    }

    static getGameById(id, callback) {
        Requester.requestToHost("GET", `api/games/${id}`, null, callback);
    }

    static getGameByUser(url_to_page, callback) {
        let url = "api/" + url_to_page.split("/api/")[1];
        // https://api.example.org/accounts/?limit=100&offset=400
        Requester.requestToHost("GET", url, null, callback);
    }

    static delGameById(id, callback) {
        Requester.requestToHost("DELETE", `api/games/${id}/`, null, callback)
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Requester;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_linkOnButtons_js__ = __webpack_require__(6);




class Page {

    constructor() {
        Page.pagePath();
        Page.pageBoxName();
        this.addEventsOnButtons();
    }

    static pagePath() {}

    static pageBoxName() {}

    addEventsOnButtons() {}

    addRedirectOnButtons(...buttons) {
        Object(__WEBPACK_IMPORTED_MODULE_0__modules_linkOnButtons_js__["a" /* default */])(...buttons)
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Page;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class PagePresenter {

    static hideAllPages() {
        let pages = document.getElementsByClassName("page");
        for (let i = 0; i < pages.length; i++) {
            pages[i].hidden = true;
        }
    }

    static showOnlyOnePage(pageName) {
        PagePresenter.hideAllPages();
        document.querySelector("." + pageName).hidden = false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PagePresenter;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__debugLog__ = __webpack_require__(0);
/**
 * Класс для работы с авторизацией
 */




class AuthWorker {

    /**
     * Возвращает token
     * @returns {string}
     */
    getToken() {
        return localStorage.getItem("token") !== null ? localStorage.getItem("token") : "no";
    }

    /**
     * Возвращает session_key
     * @returns {string}
     */
    static getSessionKey() {
        return localStorage.getItem("session_key") !== null ? localStorage.getItem("session_key") : "no";
    }

    /**
     * Возвращает username
     * @returns {string}
     */
    static getUsername() {
        return localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")).username : "no";
    }

    /**
     * Сохраняет token
     * @param resp
     */
    static setToken(resp) {
        let token = "Token " + resp.token.toString();
        localStorage.setItem("token", token);
        Object(__WEBPACK_IMPORTED_MODULE_0__debugLog__["a" /* default */])("TOKEN = " + localStorage.getItem("token"));
    }

    /**
     * Сохраняет session_key
     * @param resp
     */
    static setSessionKey(resp) {
        let session_key = resp.session_key.toString();
        localStorage.setItem("session_key", session_key);
        Object(__WEBPACK_IMPORTED_MODULE_0__debugLog__["a" /* default */])("session_key = " + localStorage.getItem("session_key"));
    }

    /**
     * Сохраняет данные текущего пользователя
     * @param resp
     */
    static setUser(resp) {
        localStorage.setItem("user", JSON.stringify(resp));
        Object(__WEBPACK_IMPORTED_MODULE_0__debugLog__["a" /* default */])("USER = " + localStorage.getItem("user"));
    }

    autharization(resp) {
        AuthWorker.setToken(resp);
        AuthWorker.setSessionKey(resp);
        AuthWorker.setUser(resp);
    }

    deleteToken() {
        localStorage.removeItem("token");
        localStorage.removeItem("session_key");
        localStorage.removeItem("user");
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AuthWorker;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = linkOnButtons;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__PagePresenter_js__ = __webpack_require__(4);




function linkOnButtons(...buttons) {
    buttons.forEach(button => {
        // document.querySelector("#" + button.button).addEventListener("touchend", function(e){
        //     e.preventDefault();
        //     e.target.click();
        // }, false);
        document.querySelector("#" + button.button).addEventListener("click", () => {
            __WEBPACK_IMPORTED_MODULE_0__PagePresenter_js__["a" /* default */].showOnlyOnePage(button.nextPage);
            history.pushState({}, "", button.pagePath);
        });
    });
}

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__debugLog__ = __webpack_require__(0);

"use strict";

const messagesToForm = {
    OK_MESSAGE: "ok",
    EMPTY_MESSAGE : "empty",
    INCORRECT_MESSAGE : "incorrect",
};

class FormValidator {

    static responseOk() {
        return messagesToForm.OK_MESSAGE;
    }

    static responseEmpty() {
        return messagesToForm.EMPTY_MESSAGE;
    }

    static responseIncorrect() {
        return messagesToForm.INCORRECT_MESSAGE;
    }

    static correctLogin(login) {
        if (!login) {
            return FormValidator.responseEmpty();
        }
        const loginRegexp = /^[\w\d]{1,100}$/;
        return (loginRegexp.test(login)) ? FormValidator.responseOk() : FormValidator.responseIncorrect();
    }

    static correctPassword(password) {
        if (!password) {
            return FormValidator.responseEmpty();
        }
        // const passwordRegexp = /\S{3,16}$/;
        const passwordRegexp = /^[\w\d]{1,100}$/;
        return (passwordRegexp.test(password)) ? FormValidator.responseOk() : FormValidator.responseIncorrect();
    }

    static hasDuplicates(array) {
        Object(__WEBPACK_IMPORTED_MODULE_0__debugLog__["a" /* default */])(array);
        for (let i = 0; i < array.length; ++i) {
            for (let j = i + 1; j < array.length; j++) {
                Object(__WEBPACK_IMPORTED_MODULE_0__debugLog__["a" /* default */])("i = " + i + "; " + j + " = " + array[i].variant + "; " + array[j].variant);
                if (array[i].variant === array[j].variant) {
                    return true;
                }
            }
        }
        return false;
    }

    static correctQuiz(quiz) {
        Object(__WEBPACK_IMPORTED_MODULE_0__debugLog__["a" /* default */])(quiz);
        let errors = [];
        let empty_flag = false;
        let necessary_fields = document.getElementsByClassName("necessary-field");

        if (quiz.title === "")
            empty_flag = true;
        if (quiz.description === "")
            empty_flag = true;
        if (quiz.tags === "")
            empty_flag = true;

        for (let i = 0; i < necessary_fields.length; i++) {
            necessary_fields[i].setAttribute('data-nec', 'true');
            Object(__WEBPACK_IMPORTED_MODULE_0__debugLog__["a" /* default */])(necessary_fields[i]);
            if (necessary_fields[i].value === "") {
                empty_flag = true;
                necessary_fields[i].setAttribute('data-nec', 'empty');
            }
        }
        quiz.questions.forEach((elem, i) => {
            if (elem.question === "")
                empty_flag = true;
            if (elem.answer.toString() === "NaN")
                empty_flag = true;
            if (elem.points.toString === "NaN")
                empty_flag = true;
            let variants = elem.variants.filter((variant) => {
                return variant !== ""
            });
            if (this.hasDuplicates(variants)) {
                errors.push(`&#9888; В вопросе ${i+1} есть повторяющиеся варианты ответа`);
            }
            if (variants < 2)
                empty_flag = true;
                // errors.push(i + "_variants_empty");
            let true_var_box = document.getElementById(`edit-quiz-form__question-box_${i}`)
                .querySelector(".true-var");
            let true_var_num = true_var_box.value;

            if (true_var_num > variants.length) {
                true_var_box.setAttribute('data-nec', 'big');
                errors.push(`&#9888; Номер правильного варианта в вопосе ${i+1} превышает количество вариантов`);
            } else {
                if (true_var_num < 1) {
                    errors.push(`&#9888; Номер правильного варианта в вопосе ${i+1} указан некорректно`);
                    true_var_box.setAttribute('data-nec', 'big');
                }
            }
            if (parseInt(elem.points) < 1) {
                errors.push(`&#9888; Число очков за ответ в вопосе ${i+1} должно быть положительным`);
                document.getElementById(`edit-quiz-form__question-box_${i}`)
                    .querySelector(".edit-points").setAttribute('data-nec', 'big');
            }
        });
        if (empty_flag) errors.push("&#9888; Заполните обязательные поля");
        return errors;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FormValidator;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


let fieldsCleaner = {
    clearFields(...fields) {
        fields.forEach(field => {
            const fieldName = "#" + field;
            let elem = document.querySelector(fieldName);
            if (elem.nodeName === "INPUT") {
                elem.value = "";
            } else if (elem.nodeName === "DIV") {
                elem.innerHTML = "";
            }
        });
    }
};

/* harmony default export */ __webpack_exports__["a"] = (fieldsCleaner);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = userGroupsByOrgId;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_globalBus__ = __webpack_require__(1);




function userGroupsByOrgId(org_id) {
    let groups = [];
    let len_groups = Object(__WEBPACK_IMPORTED_MODULE_0__modules_globalBus__["a" /* default */])().saver.userGroups.length;
    for (let i = 0; i < len_groups; i++) {
        if (Object(__WEBPACK_IMPORTED_MODULE_0__modules_globalBus__["a" /* default */])().saver.userGroups[i].group.organization.id === org_id) {
            groups.push(Object(__WEBPACK_IMPORTED_MODULE_0__modules_globalBus__["a" /* default */])().saver.userGroups[i]);
        }
    }
    return groups;
}

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Page_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__RegisterForm_js__ = __webpack_require__(11);





class RegisterPage extends __WEBPACK_IMPORTED_MODULE_0__Page_js__["a" /* default */] {

    constructor() {
        super();
        this.form = new __WEBPACK_IMPORTED_MODULE_1__RegisterForm_js__["a" /* default */]();
    }

    static pagePath() {
        return "/register";
    }

    static pageBoxName() {
        return "register-page";
    }

    getForm() {
        return this.form;
    }

    addEventsOnButtons() {

    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RegisterPage;


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_network_Requester_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_fieldsCleaner_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_PagePresenter__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_debugLog__ = __webpack_require__(0);









const messagesRegisterForm = {
    EMPTY_MESSAGE : "Заполнены не все поля",
    INCORRECT_MESSAGE : "Использованы недопустимые символы",
    RESPONSE_MESSAGE : "Некорректный ввод или логин уже существует",
    UNIQUE_MESSAGE: "Пользователь с таким логином<br>уже существует",
    TOO_SHORT_PASSWORD: "Пароль должен содержать<br>не менее 4х символов",
    SUCCESS_SIGN_UP_MESSAGE : "Вы успешо зарегистрировались!",
    CONTENT_SHOULD_BE: "Логин и пароль должны состоять<br>из латинских букв и цифр",
    INV_PASSWORD: "Некорректный пароль"
};

class RegisterForm extends __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__["a" /* default */] {

    constructor() {
        super();
        Object.assign(RegisterForm.prototype, __WEBPACK_IMPORTED_MODULE_3__modules_fieldsCleaner_js__["a" /* default */]);
        this.loginValue = "";
        this.passwordValue = "";
        this.errorBox = null;
        this.addEventsToButtons();
        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("reg FORM");
    }

    static msgEmptyField() {
        return messagesRegisterForm.EMPTY_MESSAGE;
    }

    static msgIncorrectInput() {
        return messagesRegisterForm.CONTENT_SHOULD_BE;
    }

    static msgTooShortPassword() {
        return messagesRegisterForm.TOO_SHORT_PASSWORD;
    }

    static msgNotUniqueLogin() {
        return messagesRegisterForm.UNIQUE_MESSAGE;
    }

    static msgResponseFromHost() {
        return messagesRegisterForm.RESPONSE_MESSAGE;
    }

    static msgSignUpSuccess() {
        return messagesRegisterForm.SUCCESS_SIGN_UP_MESSAGE;
    }

    static msgInvalidPassword() {
        return messagesRegisterForm.INV_PASSWORD;
    }

    static validate(loginValue, passwordValue, errorBox) {
        let login = __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__["a" /* default */].correctLogin(loginValue);
        let password = __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__["a" /* default */].correctPassword(passwordValue);

        if (login === __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__["a" /* default */].responseEmpty() || password === __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__["a" /* default */].responseEmpty()) {
            errorBox.innerHTML = RegisterForm.msgEmptyField();
            return false;
        }

        if (login === __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__["a" /* default */].responseIncorrect() || password === __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__["a" /* default */].responseIncorrect()) {
            errorBox.innerHTML = RegisterForm.msgIncorrectInput();
            return false;
        }

        errorBox.innerHTML = "";
        return true;
    }

    clearForm() {
        this.clearFields(
            "regform-login",
            "regform-password",
            "regform-err"
        );
    }

    sendRequest() {
        let msg = "";
        __WEBPACK_IMPORTED_MODULE_2__modules_network_Requester_js__["a" /* default */].register(this.loginValue, this.passwordValue, (err, resp) => {
            if (err) {
                err = JSON.parse(err.responseText);
                Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])(JSON.stringify(err));
                if (err.username !== undefined) {
                    if (err.username[0].code === "unique") {
                        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("UNIQ = ");
                        msg = RegisterForm.msgNotUniqueLogin();
                    }
                } else if (err.password !== undefined) {
                    if (err.password[0].code === "password_too_short") {
                        msg = RegisterForm.msgTooShortPassword();
                    }
                    if (err.password[0].code === "invalid") {
                        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("INV = ");
                        msg = RegisterForm.msgInvalidPassword();
                    }
                }
                return this.errorBox.innerHTML = msg;
            }
            Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().authWorker.autharization(resp);
            // alert(RegisterForm.msgSignUpSuccess());
            this.clearForm();
            Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().officePage.render();
            // PagePresenter.showOnlyOnePage("office-page");
            Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().btn.officeBtn.click();
        });
    }

    addEventsToButtons() {

        document.querySelector("#regformBtn").addEventListener("click", (event) => {
            event.preventDefault();
            this.loginValue = document.querySelector("#regform-login").value;
            this.passwordValue = document.querySelector("#regform-password").value;
            this.errorBox = document.querySelector("#regform-err");

            const valid = RegisterForm.validate(this.loginValue, this.passwordValue, this.errorBox);

            if (valid) {
                this.sendRequest();
            }
        });

        // document.querySelector(".register-page__button-back").addEventListener("click", () => {this.clearForm();});
        // document.querySelector(".register-page__link-to-login").addEventListener("click", () => {this.clearForm();});
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RegisterForm;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Page_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__LoginForm_js__ = __webpack_require__(13);





class RegisterPage extends __WEBPACK_IMPORTED_MODULE_0__Page_js__["a" /* default */] {

    constructor() {
        super();
        this.form = new __WEBPACK_IMPORTED_MODULE_1__LoginForm_js__["a" /* default */]();
    }

    static pagePath() {
        return "/login";
    }

    static pageBoxName() {
        return "login-page";
    }

    getForm() {
        return this.form;
    }

    addEventsOnButtons() {

    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RegisterPage;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_network_Requester_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_fieldsCleaner_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_PagePresenter__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_debugLog__ = __webpack_require__(0);









const messagesLoginForm = {
    EMPTY_MESSAGE : "Заполнены не все поля",
    INCORRECT_MESSAGE : "Использованы недопустимые символы",
    RESPONSE_MESSAGE : "Неправильный логин или пароль",
    SUCCESS_SIGN_IN_MESSAGE : "Вы вошли на сайт!"
};

class LoginForm extends __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__["a" /* default */] {

    constructor() {
        super();
        Object.assign(LoginForm.prototype, __WEBPACK_IMPORTED_MODULE_3__modules_fieldsCleaner_js__["a" /* default */]);
        this.loginValue = "";
        this.passwordValue = "";
        this.errorBox = null;
        this.addEventsToButtons();
        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("log FORM");
    }

    static msgEmptyField() {
        return messagesLoginForm.EMPTY_MESSAGE;
    }

    static msgIncorrectInput() {
        return messagesLoginForm.INCORRECT_MESSAGE;
    }

    static msgResponseFromHost() {
        return messagesLoginForm.RESPONSE_MESSAGE;
    }

    static msgSignUpSuccess() {
        return messagesLoginForm.SUCCESS_SIGN_IN_MESSAGE;
    }

    static validate(loginValue, passwordValue, errorBox) {
        let login = __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__["a" /* default */].correctLogin(loginValue);
        let password = __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__["a" /* default */].correctPassword(passwordValue);

        if (login === __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__["a" /* default */].responseEmpty() || password === __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__["a" /* default */].responseEmpty()) {
            errorBox.innerHTML = LoginForm.msgEmptyField();
            return false;
        }

        if (login === __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__["a" /* default */].responseIncorrect() || password === __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__["a" /* default */].responseIncorrect()) {
            errorBox.innerHTML = LoginForm.msgIncorrectInput();
            return false;
        }

        errorBox.innerHTML = "";
        return true;
    }

    clearForm() {
        this.clearFields(
            "login-form-login",
            "login-form-password",
            "login-form-err"
        );
    }

    sendRequest() {
        __WEBPACK_IMPORTED_MODULE_2__modules_network_Requester_js__["a" /* default */].auth(this.loginValue, this.passwordValue, (err, resp) => {
            if (err) {
                return this.errorBox.innerHTML = LoginForm.msgResponseFromHost();
            }
            Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().authWorker.autharization(resp);
            // alert(LoginForm.msgSignUpSuccess());
            this.clearForm();
            Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().officePage.render();
            // PagePresenter.showOnlyOnePage("office-page");
            Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().btn.officeBtn.click();
        });
    }

    addEventsToButtons() {

        document.querySelector("#login-form-btn").addEventListener("click", (event) => {
            event.preventDefault();
            this.loginValue = document.querySelector("#login-form-login").value;
            this.passwordValue = document.querySelector("#login-form-password").value;
            this.errorBox = document.querySelector("#login-form-err");

            Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("log BTN");
            const valid = LoginForm.validate(this.loginValue, this.passwordValue, this.errorBox);

            if (valid) {
                this.sendRequest();
            }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LoginForm;



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Page_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_PagePresenter__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_globalBus__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_network_Requester__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__quizzes_QuizzesDesk__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ProfileForm__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_GameManager__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__organizations_OrganizationDesk__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__modules_debugLog__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__statistic_StaticticTable__ = __webpack_require__(28);













class OfficePage extends __WEBPACK_IMPORTED_MODULE_0__Page_js__["a" /* default */] {

    constructor() {
        super();
        // щелчок по карточке курса
        let btnToCourse = document.createElement('button');
        btnToCourse.setAttribute('id', 'to-course-btn-redirect');
        btnToCourse.hidden = true;
        document.body.appendChild(btnToCourse);
        this.addRedirectOnButtons(
            {button: "to-course-btn-redirect", nextPage: "course-page", pagePath: "/course"}
        );

        this.addEventsOnButtons();
        Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("office");
        Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().user = {};
        this.profileForm = new __WEBPACK_IMPORTED_MODULE_5__ProfileForm__["a" /* default */]();

        Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().count_ws = 0;
        Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().joinBtnFlag = false;
        // this.target_pin = null;
    }

    static pagePath() {
        return "/office";
    }

    static pageBoxName() {
        return "office-page";
    }

    joinGameBtn() {
        // join to game btn
        Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameStudentPage.attachRedirect();
        document.getElementById("join-game-btn").addEventListener("click", () => {
            const game_id = parseInt(document.getElementById("game-pin-input").value);
            Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("INPUT ID = " + game_id);
            if (!isNaN(game_id)) {
                document.getElementById("join-game-btn_clicker").click(); // redirect
                document.getElementById("game-pin-input").setAttribute('data-nec', 'true');
                Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.join(game_id);
                Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().count_ws += 1;
                Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("WS COUNT = " + Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().count_ws);
                document.getElementById("game-pin-input").value = "";
            } else {
                document.getElementById("game-pin-input").setAttribute('data-nec', 'empty');
            }
        });
    }

    renderListManaged(){
        __WEBPACK_IMPORTED_MODULE_3__modules_network_Requester__["a" /* default */].getRunningGameByUser((err, resp) => {
            if (err) {
                Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("err load user running games");
            } else {
                Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("RESP");
                Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])(resp);
                Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().saver.userRunningGames = [];
                let games = resp;
                let len_games = games.length;
                for (let i = 0; i < len_games; i++) {
                    Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().saver.userRunningGames.push(games[i]);
                }
                // this.target_pin = null;
                let running_game_box = document.getElementById("rannunig-games-warning");
                running_game_box.innerHTML = "";
                if (Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().saver.userRunningGames.length !== 0) {
                    let managed_game = Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().saver.userRunningGames;
                    let managed_game_len = managed_game.length;
                    if (managed_game_len !== 0) {
                        let content = "";
                        for (let i = 0; i < managed_game_len; i++) {
                            let div = document.createElement('div');
                            running_game_box.appendChild(div);
                            div.innerHTML = `
                                <div class="alert alert-light" role="alert">
                                <button id="delete-managed-by-id-${managed_game[i].id}" type="button" class="btn btn-danger">
                                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                                </button>&nbsp;
                                <button id="select-managed-by-id-${managed_game[i].id}" type="button" class="btn btn-success">
                                    <i class="fa fa-play" aria-hidden="true"></i>
                                </button> &nbsp;
                                <red>&#9888; У вас есть запущенное вами соревнование PIN ${managed_game[i].id}</red>
                                </div>
                            `;
                            document.getElementById(`select-managed-by-id-${managed_game[i].id}`).onclick = () => {
                                Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.joined_counter = 0;
                                Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameTeacherPage.attachRedirect();
                                Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.restart_manage(managed_game[i].id);
                                document.getElementById("start-game-btn_clicker").click(); // redirect
                                div.innerHTML = "";
                                // this.target_pin = managed_game[i].id;
                                Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("REDIRECT TO RESTART");
                            };
                            document.getElementById(`delete-managed-by-id-${managed_game[i].id}`).onclick = () => {
                                __WEBPACK_IMPORTED_MODULE_3__modules_network_Requester__["a" /* default */].delGameById((managed_game[i].id), (err, resp) => {
                                    if (err) {
                                        console.log("err of del game")
                                    } else {
                                        div.innerHTML = "";
                                    }
                                });
                            }
                        }
                    }
                }
            }
        });
        Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("__________________RUNNING GAMES =");
        Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().saver.userRunningGames);
    }

    rejoinManagedGameBtn() {
        document.getElementById("managed-game-btn").onclick = () => {
            if (this.target_pin !== null) {
                Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.joined_counter = 0;
                Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameTeacherPage.attachRedirect();
                Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.restart_manage(this.target_pin);
                document.getElementById("start-game-btn_clicker").click(); // redirect
                document.getElementById("selected-managed-game").innerHTML = "Управляемые PIN...";
                Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("REDIRECT TO RESTART");
            }
        }
    }

    render() {
        return __WEBPACK_IMPORTED_MODULE_3__modules_network_Requester__["a" /* default */].whoami((err, resp) => {
            if (err) {
                Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("office err");
            } else {
                Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().user = resp;
                document.getElementById("office-header-username").innerHTML = Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().user.username;
                Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().nav.loginBox.innerHTML = resp.username;
                this.profileForm.setFormValues(resp);
                __WEBPACK_IMPORTED_MODULE_7__organizations_OrganizationDesk__["a" /* default */].render();
                __WEBPACK_IMPORTED_MODULE_4__quizzes_QuizzesDesk__["a" /* default */].render();
                __WEBPACK_IMPORTED_MODULE_9__statistic_StaticticTable__["a" /* default */].render();
                this.renderListManaged();
                // добавляем листнеры на кнопу присоединиться
                if (Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().joinBtnFlag === false) {
                    this.joinGameBtn();
                    // this.rejoinManagedGameBtn();
                    Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().joinBtnFlag = true;
                }
                Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("office norm");
            }
        });
    }

    addEventsOnButtons() {
        document.getElementById("to-courses-btn").onclick = () => {
            Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("C1");
            document.getElementById("org-desk").hidden = false;
            document.getElementById("to-quizzes-btn").classList.remove("active");
            document.getElementById("quizzes-desk").hidden = true;
            document.getElementById("to-courses-btn").classList.add("active");
            document.getElementById("profile").hidden = true;
            document.getElementById("to-profile-btn").classList.remove("active");
            document.getElementById("statistic").hidden = true;
            document.getElementById("to-statistic-btn").classList.remove("active");
        };

        document.getElementById("to-quizzes-btn").onclick = () => {
            Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("C2");
            document.getElementById("org-desk").hidden = true;
            document.getElementById("to-quizzes-btn").classList.add("active");
            document.getElementById("quizzes-desk").hidden = false;
            document.getElementById("to-courses-btn").classList.remove("active");
            document.getElementById("profile").hidden = true;
            document.getElementById("to-profile-btn").classList.remove("active");
            document.getElementById("statistic").hidden = true;
            document.getElementById("to-statistic-btn").classList.remove("active");
        };

        document.getElementById("to-profile-btn").onclick = () => {
            Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("C3");
            document.getElementById("org-desk").hidden = true;
            document.getElementById("to-quizzes-btn").classList.remove("active");
            document.getElementById("quizzes-desk").hidden = true;
            document.getElementById("to-courses-btn").classList.remove("active");
            document.getElementById("profile").hidden = false;
            document.getElementById("to-profile-btn").classList.add("active");
            document.getElementById("statistic").hidden = true;
            document.getElementById("to-statistic-btn").classList.remove("active");
        };

        document.getElementById("to-statistic-btn").onclick = () => {
            Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("C1");
            document.getElementById("org-desk").hidden = true;
            document.getElementById("to-quizzes-btn").classList.remove("active");
            document.getElementById("quizzes-desk").hidden = true;
            document.getElementById("to-courses-btn").classList.remove("active");
            document.getElementById("profile").hidden = true;
            document.getElementById("to-profile-btn").classList.remove("active");
            document.getElementById("statistic").hidden = false;
            document.getElementById("to-statistic-btn").classList.add("active");
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = OfficePage;


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__globalBus__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__network_Requester__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__network_WsController__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__debugLog__ = __webpack_require__(0);







class GameManager {
    constructor() {
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameManager = this;
        Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])("GAME MANAGER START");
        this.ws_controller = null;
        this.game_id = null;
        this.joined_counter = 0;
        this.answered_counter = 0;
        this.game_started = false;
    }

    start(quiz_id, game_title, group_id) {
        document.getElementById("focus-btn").focus();
        // запрос на создание игры /games/
        Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])("Переход на страницу с игрой " + quiz_id);
        __WEBPACK_IMPORTED_MODULE_1__network_Requester__["a" /* default */].createGame(quiz_id, game_title, group_id, (err, resp) => {
            if (err) {
                Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])(err);
                return;
            }
            this.game_id = resp.id;
            Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameTeacherPage.renderQuizNum(this.game_id);
            Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])("GAME ID = " + this.game_id);
            this.ws_controller = new __WEBPACK_IMPORTED_MODULE_2__network_WsController__["a" /* default */]("teacher");
            Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])("WS");
        });
    }

    restart_manage(game_id) {
        document.getElementById("focus-btn").focus();
        __WEBPACK_IMPORTED_MODULE_1__network_Requester__["a" /* default */].getGameById(game_id, (err, resp) => {
           if (err) {
               Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])("err in get game by id")
           } else {
               this.game_id = game_id;
               let ws_dataObj = {
                   payload: {}
               };
               ws_dataObj.payload.data = resp;
               this.joined_counter = resp.players.length;

               Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])("my DATA OBJ");
               Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])(ws_dataObj);

               if (resp.state === "players_waiting") {
                   this.answered_counter = 0;
                   Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameTeacherPage.renderQuizNum(game_id);
                   Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameTeacherPage.renderJoinedCounter();
               } else if (resp.state === "answering") {
                   this.answered_counter = resp.current_question.players_answers.length;
                   Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameTeacherPage.renderQuizNum(game_id);
                   Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameTeacherPage.prepareGameMode();
                   Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameTeacherPage.renderAnsweredCounter();
                   Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameTeacherPage.renderQuestion(ws_dataObj);
               }

               Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])("GAME ID = " + this.game_id);
               this.ws_controller = new __WEBPACK_IMPORTED_MODULE_2__network_WsController__["a" /* default */]("teacher");
               Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])("WS");
           }
        });
    }

    join(game_id) {
        document.getElementById("focus-btn").focus();
        this.game_id = game_id;
        this.ws_controller = new __WEBPACK_IMPORTED_MODULE_2__network_WsController__["a" /* default */]("student");
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameStudentPage.renderWaitingStart();
    }


    switchNext(){
        if (this.game_started === false) {
            Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameTeacherPage.prepareGameMode();
            this.game_started = true;
        }
        this.answered_counter = 0;
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameTeacherPage.renderAnsweredCounter();
        this.ws_controller.sendNextMessage(this.game_id);
    }

    showTrueAnswer() {
        Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])("true ans send");
        this.ws_controller.sendTrueAnsForAll(this.game_id);
    }

    sendAnswer(var_index, cur_question_id) {
        this.ws_controller.sendAnswerMessage(this.game_id, var_index, cur_question_id);
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameStudentPage.renderWaitingNext();
    }

    reset() {
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().prev_game = this.game_id;
        this.ws_controller.disconnect();
        this.ws_controller = null;
        this.game_id = null;
        this.joined_counter = 0;
        this.answered_counter = 0;
        this.game_started = false;
    }

    stop() {

    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameManager;


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Page__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_network_Requester_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_linkOnButtons__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_globalBus_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__organizationCard__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_debugLog__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_network_AuthWorker__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__userGroupsByOrgId__ = __webpack_require__(9);











class OrganizationDesk extends __WEBPACK_IMPORTED_MODULE_0__Page__["a" /* default */] {

    static render() {
        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("Quiz Desk");
        let orgDesk = document.getElementById("org-desk");
        orgDesk.innerHTML = "";
        let cardsInRow = 0;
        let rowCount = 1;
        let resp = Object(__WEBPACK_IMPORTED_MODULE_3__modules_globalBus_js__["a" /* default */])().saver.userOrg;

        if (resp.length === 0) {
            orgDesk.innerHTML = "<h3>Вы не состоите ни в одной организации</h3>";
        }
        for (let i = 0; i < resp.length; i++) {
            if (cardsInRow === 3) {
                cardsInRow = 0;
                rowCount++;
            }
            if (cardsInRow === 0) {
                let newRow = document.createElement('div');
                newRow.setAttribute("id", `org-card-row-${rowCount}`);
                newRow.setAttribute("class", "row equal-height-col");
                orgDesk.appendChild(newRow);
                Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("new row = ");
                Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])(newRow);
            }
            let caCol = document.createElement('div');
            caCol.setAttribute("class", "col-sm-4");
            let caBox = document.createElement('div');
            caBox.setAttribute("id", `org-card-${resp[i].id}`);
            caBox.setAttribute("class", "card org-desk__org-card card-in-col");
            let groups = [];
            let org_id = resp[i].id;
            groups = Object(__WEBPACK_IMPORTED_MODULE_7__userGroupsByOrgId__["a" /* default */])(org_id);

            caBox.innerHTML = Object(__WEBPACK_IMPORTED_MODULE_4__organizationCard__["a" /* default */])(resp[i].name, groups.length, resp[i].updated_at.split("T")[0]);
            caCol.appendChild(caBox);
            document.getElementById(`org-card-row-${rowCount}`).appendChild(caCol);
            document.getElementById(`org-card-${resp[i].id}`).onclick = () => {
                Object(__WEBPACK_IMPORTED_MODULE_3__modules_globalBus_js__["a" /* default */])().course_page_flag = true; // для роутера
                OrganizationDesk.redirectToOrganization(resp[i].id, resp[i].name)
            };
            cardsInRow++;
        }
    }

    static redirectToOrganization(id, name) {
        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("redirect to course " + id + " with name " + name);
        Object(__WEBPACK_IMPORTED_MODULE_3__modules_globalBus_js__["a" /* default */])().organizationPage.render(id, name);
    }

    static organizationReq(callback) {
        __WEBPACK_IMPORTED_MODULE_1__modules_network_Requester_js__["a" /* default */].organizationsAll((err, resp) => {
            if (err) {
                return alert("all organizations error");
            }
            Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])(resp);
            let userOrganizations = [];
            let organizations_len = resp.length;
            for (let i = 0; i < organizations_len; i++) {
                let admins = resp[i].admins;
                let admins_len = admins.length;
                Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])(resp[i]);
                for (let j = 0; j < admins_len; j++){
                    if (admins[j].user.username === __WEBPACK_IMPORTED_MODULE_6__modules_network_AuthWorker__["a" /* default */].getUsername()) {
                        userOrganizations.push(resp[i]);
                        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("pushed");
                    }
                }
            }
            callback(userOrganizations);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = OrganizationDesk;


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = organizationCard;


function organizationCard(name, group_len, date) {
    return `<img class="card-img-top" src="img/course_logo.png" alt="Card image cap">
            <div class="card-body pointer">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">${group_len} групп на курсе</p>
            </div>
            <div class="card-footer">
                <small class="text-muted">Дата изменения ${date}</small>
            </div>`
}

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Page_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_PagePresenter__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_network_Requester__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_globalBus__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_network_AuthWorker__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_debugLog__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__office_organizations_organizationCard__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__userGroupsByOrgId__ = __webpack_require__(9);











class OrganizationPage extends __WEBPACK_IMPORTED_MODULE_0__Page_js__["a" /* default */] {

    constructor() {
        super();
        this.addEventsOnButtons();

        let btnToGroup = document.createElement('button');
        btnToGroup.setAttribute('id', 'to-group-btn-redirect');
        btnToGroup.hidden = true;
        document.body.appendChild(btnToGroup);
        this.addRedirectOnButtons(
            {button: "to-group-btn-redirect", nextPage: "group-page", pagePath: "/group"}
        );

        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("course")
    }

    static pagePath() {
        return "/course";
    }

    static pageBoxName() {
        return "course-page";
    }

    render(org_id, org_name) {
        document.getElementById("to-course-btn-redirect").click();
        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("ID ORGANIZATION = " + org_id + "_________userGroupsByOrgId");
        document.querySelector("#org-title span").innerHTML = org_name;
        let groups = Object(__WEBPACK_IMPORTED_MODULE_7__userGroupsByOrgId__["a" /* default */])(org_id);
        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])(groups);
        let groups_len = groups.length;
        let table_groups = document.getElementById("table-groups-in-org");
        table_groups.innerHTML = "";

        for (let i = 0; i < groups_len; i++) {
            table_groups.innerHTML += `<div id="group-card-${groups[i].group.id}" class="card game-card-in-group">
            </div>`;

            __WEBPACK_IMPORTED_MODULE_2__modules_network_Requester__["a" /* default */].getRunningGameByGroupId(groups[i].group.id, (err, resp) => {
                if (err) {
                    Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("err with running games of group");
                } else {
                    let running_games = resp;
                    let len_games = running_games.length;
                    if (len_games > 0) {
                        // document.getElementById("no-games-in-group").hidden = true;
                        let group_card = document.getElementById(`group-card-${groups[i].group.id}`);
                        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("_______________>       >        >        >_______________");
                        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])(running_games);
                        let htmlContent = `<div class="card-header">
                            ${groups[i].group.name}
                            </div>`;
                        for (let i = 0; i < len_games; i++) {
                            Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])(running_games[i]);
                            Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])(running_games[i].id);
                            htmlContent += `<div id="group-game-${running_games[i].id}" class="card-body">
                                <h5 class="card-title"><u>PIN</u> ${running_games[i].id}</h5>
                                <p class="card-text"><u>Название:</u> ${running_games[i].quiz.title}</p>
                                <a id="to-group-game-btn-${running_games[i].id}" class="btn btn-success">Присоединиться</a>
                              </div>
                              <hr>`;
                        }

                        group_card.innerHTML = htmlContent;

                        for (let i = 0; i < len_games; i++) {
                            let to_game_by_id_btn = document.getElementById(`to-group-game-btn-${running_games[i].id}`);
                            to_game_by_id_btn.onclick = () => {
                                // можно добавить проверку роли
                                // задаем PIN в поле ввода
                                Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("пишу ПИН = " + running_games[i].id.toString());
                                document.getElementById("game-pin-input").value = running_games[i].id.toString();
                                // нажимаем на кнопку join и присоедин как ученик
                                document.getElementById("join-game-btn").click();
                            }
                        }
                    } else {
                        let group_card = document.getElementById(`group-card-${groups[i].group.id}`);
                        let htmlContent = `<div class="card-header">
                            ${groups[i].group.name}
                            </div>`;
                        group_card.innerHTML = htmlContent + `<div id="no-games-in-group" class="card-body">
                            <h5 class="card-title">В группе нет активных соревнований</h5>
                          </div>`;
                    }
                }
            })
        }
    }

    addEventsOnButtons() {

    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = OrganizationPage;


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Page_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_PagePresenter__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_debugLog__ = __webpack_require__(0);






class GroupPage extends __WEBPACK_IMPORTED_MODULE_0__Page_js__["a" /* default */] {

    constructor() {
        super();
        this.addEventsOnButtons();
        this.addRedirectOnButtons(
            {button: "to-play-btn-1", nextPage: "play-page", pagePath: "/play"}
        );
        Object(__WEBPACK_IMPORTED_MODULE_2__modules_debugLog__["a" /* default */])("group")
    }

    static pagePath() {
        return "/group";
    }

    static pageBoxName() {
        return "group-page";
    }

    addEventsOnButtons() {

    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GroupPage;


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_network_Requester_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_fieldsCleaner_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_PagePresenter__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Page__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__questionBox__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__emptyQuizForm__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__modules_debugLog__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__office_organizations_OrganizationDesk__ = __webpack_require__(16);













class QuizEditorPage extends __WEBPACK_IMPORTED_MODULE_5__Page__["a" /* default */] {
    constructor() {
        super();
        this.index = 1; // номер вопроса
        Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("Quiz editor");
        this.quiz = {};
        this.resetQuiz();
        Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().quizEditorPage = this;

        this.editQuizById = false;
        this.target_group_id = null;
    }

    resetQuiz() {
        this.quiz = {
            title: "",
            description: "",
            tags: "",
            questions: []
        };
        this.index = 1;
    }

    addQuestion(i) {
        Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("INDEX = " + i);
        i = document.getElementsByClassName("edit-quiz-form__question-box").length;
        Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("INDEX+ = " + i);
        let qBox = document.createElement('div');
        qBox.innerHTML = Object(__WEBPACK_IMPORTED_MODULE_6__questionBox__["a" /* default */])(i);
        document.getElementById("edit-quiz-form__questions").appendChild(qBox);
        document.getElementById(`delete-question-box_${i}`).onclick = () => {
            this.deleteQuestion(i);
            Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])(i);
        };
        this.index++;
    }

    pushToQuiz() {
        this.quiz.title =
            document.getElementById("edit-quiz-form").querySelector("#edit-quiz-form__title").value;
        this.quiz.description =
            document.getElementById("edit-quiz-form").querySelector("#edit-quiz-form__description").value;
        this.quiz.tags =
            document.getElementById("edit-quiz-form").querySelector("#edit-quiz-form__tags").value.split(",");

        let qBoxes = document.getElementsByClassName("edit-quiz-form__question-box");
        for (let i = 0; i < qBoxes.length; i++) {
            let variants = [];
            let qVariants = qBoxes[i].getElementsByClassName("edit-variant");
            let variantsNum = qVariants.length;
            for (let k = 0; k < variantsNum; k++) {
                let variantContent = qVariants[k].value.toString();
                if (variantContent !== "") {
                    variants.push({
                        variant: variantContent
                    });
                }
            }
            this.quiz.questions.push({
                type: "single",
                question: qBoxes[i].querySelector(".edit-question").value.toString(),
                variants: variants,
                answer: [parseInt(qBoxes[i].querySelector(".edit-answer").value)],
                points: parseInt(qBoxes[i].querySelector(".edit-points").value),
            });
        }

        Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])(this.quiz);
    }

    validate() {
        let errors = __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__["a" /* default */].correctQuiz(this.quiz);
        Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("err = " + errors);
        if (errors.length !== 0) {
            Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("__________________________________");
            // document.getElementById("edit-quiz-err").innerHTML = "Обязательные поля не заполнены или заполнены с ошибками";
            document.getElementById("edit-quiz-err").innerHTML = errors.join('<br>');
            return false;
        }
        return true;
    }

    sendRequest() {
        if (this.editQuizById !== false) {
            __WEBPACK_IMPORTED_MODULE_2__modules_network_Requester_js__["a" /* default */].quizEdit(this.editQuizById, this.quiz, (err, resp) => {
                if (err) {
                    document.getElementById("edit-quiz-err").innerHTML = "&#9888; Обязательные поля не заполнены или заполнены с ошибками";
                    return Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("err in quiz");
                } else {
                    Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("ok in quiz edit" + resp);
                    Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().btn.officeBtn.click();
                    this.editQuizById = false;
                }
            });
        } else {
            __WEBPACK_IMPORTED_MODULE_2__modules_network_Requester_js__["a" /* default */].quizNew(this.quiz, (err, resp) => {
                if (err) {
                    document.getElementById("edit-quiz-err").innerHTML = "&#9888; Обязательные поля не заполнены или заполнены с ошибками";
                    return Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("err in quiz");
                }
                Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("ok in quiz" + resp);
                Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().btn.officeBtn.click();
            });
        }
    }

    startQuizBtn(resp) {
        let startGameBtn = document.createElement('button');
        startGameBtn.innerHTML = "Запуcтить";
        startGameBtn.setAttribute("id", "start-game-btn");
        startGameBtn.setAttribute("class", "btn btn-success start-btn");
        document.getElementById("quiz-editor-h3").appendChild(startGameBtn);
        Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().gameManager.joined_counter = 0;
        Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().gameTeacherPage.attachRedirect();
        startGameBtn.addEventListener("click", () => {
            Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("ID = " + this.target_group_id);
            document.getElementById("start-game-btn_clicker").click();
            Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().gameManager.start(this.editQuizById, resp.title, this.target_group_id);
        });
    }

    selectTargetGroupBtn(organizations) {
        let targetBox = document.getElementById("target-group-box");
        targetBox.innerHTML =
            `<div class="btn-group org-btn-group list-btn">
                <button id="selected-org" type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Выберите организацию...
                </button>
                    
                <div id="list-org-btn" class="dropdown-menu" x-placement="bottom-start" style="position: absolute; transform: translate3d(0px, 38px, 0px); top: 0px; left: 0px; will-change: transform;">
                    <!--<a class="dropdown-item" href="#">Школа 444</a>-->
                </div>
            </div>
            <div class="btn-group group-btn-group list-btn">
                <button id="selected-group" type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Выберите группу...
                </button>

                <div id="list-group-btn" class="dropdown-menu" x-placement="bottom-start" style="position: absolute; transform: translate3d(0px, 38px, 0px); top: 0px; left: 0px; will-change: transform;">
                    <!--<a class="dropdown-item" href="#">Класс 5Б</a>-->
                </div>
            </div>`;
        let org_len = organizations.length;
        let listOrgBtn = document.getElementById("list-org-btn");
        listOrgBtn.innerHTML = "";
        let listGroupBtn = document.getElementById("list-group-btn");
        listGroupBtn.innerHTML = "";
        document.getElementById("selected-org").innerHTML = "Выберите организацию...";
        document.getElementById("selected-group").innerHTML = "Выберите группу...";
        for (let i = 0; i < org_len; i++) {
            let a = document.createElement('a');
            a.setAttribute('class', 'dropdown-item');
            listOrgBtn.appendChild(a);
            a.innerHTML = organizations[i].name;
            a.setAttribute('id', `select-org-by-id-${organizations[i].id}`);
            a.onclick = () => {
                Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("change selected-org text");
                document.getElementById("selected-org").innerHTML = organizations[i].name;
                this.renderListGroupByOrg(organizations[i].id);
            }
        }
    }

    renderListGroupByOrg(org_id) {
        let groups = [];
        let len_groups = Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().saver.userTeacherGroups.length;
        for (let i = 0; i < len_groups; i++) {
            if (Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().saver.userTeacherGroups[i].organization.id === org_id) {
                groups.push(Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().saver.userTeacherGroups[i]);
            }
        }
        Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])(groups);
        let groups_len = groups.length;
        let listGroupBtn = document.getElementById("list-group-btn");
        listGroupBtn.innerHTML = "";
        document.getElementById("selected-group").innerHTML = "Выберите группу...";
        this.target_group_id = null;

        for (let i = 0; i < groups_len; i++) {
            Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])(groups[i]);
            Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("________________________");
            Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])(listGroupBtn);
            let a = document.createElement('a');
            a.setAttribute('class', 'dropdown-item');
            listGroupBtn.appendChild(a);
            a.innerHTML = groups[i].name;
            Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])(groups[i].name);
            a.setAttribute('id', `select-group-by-id-${groups[i].id}`);
            a.onclick = () => {
                Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("change selected-group text " + groups[i].id);
                document.getElementById("selected-group").innerHTML = groups[i].name;
                this.target_group_id = groups[i].id;
            }
        }
    }

    render(id, resp) {
        document.getElementById("new-quiz").click();
        Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("ID = " + id);
        this.editQuizById = id;
        // добавить id викторины в заголовок
        document.getElementById("quiz-editor-h3").innerHTML = `Моя викторина`;
        // кнопка запуска викторины
        this.startQuizBtn(resp);
        this.selectTargetGroupBtn(Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().saver.userTeacherOrg);
        document.getElementById("edit-quiz-form").querySelector("#edit-quiz-form__title").value =
            resp.title;
        document.getElementById("edit-quiz-form").querySelector("#edit-quiz-form__description").value =
            resp.description;
        document.getElementById("edit-quiz-form").querySelector("#edit-quiz-form__tags").value =
            resp.tags.join();
        // количество вопросов
        let questionsCount = resp.questions.length;
        Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("questionsCount" + questionsCount);
        // генерирую под них боксы
        for (let i = 1; i < questionsCount; i++) {
            this.index = i;
            this.addQuestion(i);
        }
        // коллекция боксов
        let qBoxes = document.getElementsByClassName("edit-quiz-form__question-box");
        // бежим по ней
        for (let i = 0; i < questionsCount; i++) {
            qBoxes[i].querySelector(".edit-question").value = resp.questions[i].question;
            let variantsResp = resp.questions[i].variants;
            let variantsNum = resp.questions[i].variants.length;
            let variantEdit = qBoxes[i].getElementsByClassName("edit-variant");
            let ans_id = resp.questions[i].answer[0];
            let ans_num = 0;
            for (let k = 0; k < variantsNum; k++) {
                variantEdit[k].value = variantsResp[k].variant;
                if (variantsResp[k].id === ans_id) {
                    ans_num = k + 1;
                }
            }
            qBoxes[i].querySelector(".edit-answer").value = ans_num;
            qBoxes[i].querySelector(".edit-points").value = resp.questions[i].points;
            // document.getElementById(`delete-question-box_${i}`).onclick = () => {
            //     this.deleteQuestion(i);
            // };
        }
    }

    addEventsOnButtons() {
        document.getElementById("edit-quiz-form__add-question-btn").onclick = () => {
            this.addQuestion(this.index);
        };

        document.getElementById("edit-quiz-form__send-btn").onclick = () => {

            this.pushToQuiz();

            if (this.validate()) {
                this.sendRequest();
                this.resetQuiz();
                document.getElementById("edit-quiz-err").innerHTML = "";
            } else {
                this.resetQuiz();
            }
        };
    }

    clearForm() {
        Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("clear form");
        this.editQuizById = false;
        Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])(this.editQuizById);
        document.querySelector(".edit-page__form").innerHTML = "";
        document.querySelector(".edit-page__form").innerHTML = Object(__WEBPACK_IMPORTED_MODULE_7__emptyQuizForm__["a" /* default */])();
        this.index = 1;
    }

    deleteQuestion(i) {
        Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().modalWindow.setHeader("Удаление вопроса");
        Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().modalWindow.setBody(`Вы уверены, что хотите удалить ${i+1} вопрос?`);
        Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().modalWindow.show();
        Object(__WEBPACK_IMPORTED_MODULE_1__modules_globalBus_js__["a" /* default */])().modalWindow.addEventsOnButtons(() => {
            Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])("func for OK");
            let el = document.getElementById(`edit-quiz-form__question-box_${i}`).parentNode;
            el.parentNode.removeChild(el);
            this.index -= 1;
            let qBoxes = document.getElementsByClassName("edit-quiz-form__question-box");
            for (let i = 1; i < qBoxes.length; i++) {
                qBoxes[i].setAttribute('id', `edit-quiz-form__question-box_${i}`);
                qBoxes[i].querySelector('.delete-question-box').setAttribute('id', `delete-question-box_${i}`);
                qBoxes[i].querySelector('.q_num_span').setAttribute('id', `q_num_${i}`);
                qBoxes[i].querySelector('.q_num_span').innerHTML = `Вопрос ${i + 1}<red>&nbsp;*</red>`;
                document.getElementById(`delete-question-box_${i}`).onclick = () => {
                    this.deleteQuestion(i);
                    Object(__WEBPACK_IMPORTED_MODULE_8__modules_debugLog__["a" /* default */])(i);
                };
            }
            // edit-quiz-form__question-box_${index}
            // delete-question-box_${index}
            // <span id=q_num_${index} class="input-group-text">Вопрос ${index + 1} </span>
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = QuizEditorPage;



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = htmlEntities;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__debugLog__ = __webpack_require__(0);




function htmlEntities(s) {
    s = s + "";
    let div = document.createElement('div');
    let text = document.createTextNode(s);
    div.appendChild(text);
    Object(__WEBPACK_IMPORTED_MODULE_0__debugLog__["a" /* default */])("______@@@______" + div.innerHTML);
    return div.innerHTML;
}


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__globalBus_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Router_js__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__views_registion_RegisterPage_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__views_registion_RegisterForm_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__views_login_LoginPage_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__views_login_LoginForm_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__views_office_OfficePage_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__views_organization_OrganizationPage_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__views_GroupPage_js__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__network_Requester_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__network_AuthWorker__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__views_edit_quiz_QuizEditorPage__ = __webpack_require__(20);















function startApp() {
    console.log("HELLO APP");
    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().authWorker = new __WEBPACK_IMPORTED_MODULE_10__network_AuthWorker__["a" /* default */]();
    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().router = new __WEBPACK_IMPORTED_MODULE_1__Router_js__["a" /* default */]();
    let router = Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().router;
    // router = router.getMe(router);
    // router.sendRouter();

    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().unloadFunc = (event) => {
        event.preventDefault();
        event.returnValue = '';
    };

    window.addEventListener("beforeunload", Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().unloadFunc);
    // document.body.onbeforeunload = () => {
    //     return "try to go away";
    // };
}

function changingColor() {
    let colorValue = {
        R: 255,
        G: 0,
        B: 0
    };

    let growFlag = true;

    let colorInterval = setInterval(() => {
        document.body.style.backgroundColor = "rgb("+colorValue.R+", "+colorValue.G+", " + colorValue.B+")";
        if (colorValue.G <= 250 && growFlag) {
            colorValue.G += 1;
        } else if (colorValue.G >= 5 && !growFlag) {
            colorValue.G -= 1;
        } else growFlag = !growFlag;
    }, 100);
}

window.addEventListener("load", function () {
    // changingColor();
    startApp();
    document.querySelector(".main-box").hidden = false;
});

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__globalBus_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__views_registion_RegisterPage_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__views_login_LoginPage_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__PagePresenter_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__linkOnButtons_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__views_office_OfficePage__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__views_organization_OrganizationPage__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__views_GroupPage__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__network_Requester__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__views_edit_quiz_QuizEditorPage__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__GameManager__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__views_GameTeacherPage__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__views_GameStudentPage__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__views_ModalWindow__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__debugLog__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__saveUserMembership__ = __webpack_require__(35);



















class Router {
    constructor() {

        this.addRedirectOnNavBtn(
            {button: "nav-main-btn", nextPage: "main-page", pagePath: "/main"},
            {button: "nav-logo-btn", nextPage: "main-page", pagePath: "/main"},
            {button: "nav-login-btn", nextPage: "login-page", pagePath: "/login"},
            {button: "nav-info-btn", nextPage: "info-page", pagePath: "/info"},
            {button: "nav-office-btn", nextPage: "office-page", pagePath: "/office"}
        );

        // global nav
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn = {};
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().nav = {};
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.loginBtn = document.getElementById("nav-login-btn");
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.signoutBtn = document.getElementById("nav-signout-btn");
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().nav.loginBox = document.getElementById("nav-login-box");
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.officeBtn = document.getElementById("nav-office-btn");

        let navBtnArr = document.getElementsByClassName('btnLink');
        for (let i = 0; i < navBtnArr.length; i++) {
            navBtnArr[i].addEventListener('click',() => {
                for (let j = 0; j < navBtnArr.length; j++) {
                    navBtnArr[j].parentNode.setAttribute('class', 'nav-item');
                }
                navBtnArr[i].parentNode.setAttribute('class', 'nav-item active');
            });
        }

        new __WEBPACK_IMPORTED_MODULE_13__views_ModalWindow__["a" /* default */]();

        // page
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().registerPage = new __WEBPACK_IMPORTED_MODULE_1__views_registion_RegisterPage_js__["a" /* default */]();
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().loginPage = new __WEBPACK_IMPORTED_MODULE_2__views_login_LoginPage_js__["a" /* default */]();
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().officePage = new __WEBPACK_IMPORTED_MODULE_5__views_office_OfficePage__["a" /* default */]();
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().organizationPage = new __WEBPACK_IMPORTED_MODULE_6__views_organization_OrganizationPage__["a" /* default */]();
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().groupPage = new __WEBPACK_IMPORTED_MODULE_7__views_GroupPage__["a" /* default */]();
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().quizEditor = new __WEBPACK_IMPORTED_MODULE_9__views_edit_quiz_QuizEditorPage__["a" /* default */]();

        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().gameTeacherPage = new __WEBPACK_IMPORTED_MODULE_11__views_GameTeacherPage__["a" /* default */]();
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().gameStudentPage = new __WEBPACK_IMPORTED_MODULE_12__views_GameStudentPage__["a" /* default */]();
        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().gameManager = new __WEBPACK_IMPORTED_MODULE_10__GameManager__["a" /* default */]();

        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().course_page_flag = false; // для редиректа при обновлении /course

        // pagePath
        const registerPagePath = __WEBPACK_IMPORTED_MODULE_1__views_registion_RegisterPage_js__["a" /* default */].pagePath();
        // const infoPage = new InfoPage();

        Object(__WEBPACK_IMPORTED_MODULE_4__linkOnButtons_js__["a" /* default */])(
            {button: "regform-to-login-link", nextPage: "login-page", pagePath: "/login"},
            {button: "login-form-to-register-link", nextPage: "register-page", pagePath: "/register"},
        );

        document.getElementById("participate-btn").onclick = () => {
            Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.officeBtn.click();
        };

        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.signoutBtn.onclick = () => {
            Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().authWorker.deleteToken();
            Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.signoutBtn.hidden =true;
            Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.loginBtn.hidden =false;
            // globalBus().btn.loginBtn.click();
            Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().nav.loginBox.innerHTML = "";
            window.removeEventListener("beforeunload", Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().unloadFunc);
            window.location = "/login";
        };

        Router.redirect();

        window.addEventListener("popstate", () => {
            Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().modalWindow.hide();
            Router.redirect();
            // registerPage.getForm().clearForm();
            // this.loginPage.getForm().clearForm();
        });
    }

    navigate() {

    }

    addRedirectOnNavBtn(...buttons) {
        Object(__WEBPACK_IMPORTED_MODULE_4__linkOnButtons_js__["a" /* default */])(...buttons);
    }

    static redirect() {
        const pathname = window.location.pathname;
        __WEBPACK_IMPORTED_MODULE_8__network_Requester__["a" /* default */].whoami((err, resp) => {
            if (err) {
                Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.signoutBtn.hidden =true;
                Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.loginBtn.hidden =false;
                Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().nav.loginBox.innerHTML = "";
                switch (pathname) {

                    case "/":
                        __WEBPACK_IMPORTED_MODULE_3__PagePresenter_js__["a" /* default */].showOnlyOnePage("main-page");
                        break;

                    case "/main":
                        __WEBPACK_IMPORTED_MODULE_3__PagePresenter_js__["a" /* default */].showOnlyOnePage("main-page");
                        break;

                    case "/office":
                        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.loginBtn.click();
                        break;

                    case "/register":
                        __WEBPACK_IMPORTED_MODULE_3__PagePresenter_js__["a" /* default */].showOnlyOnePage("register-page");
                        break;

                    case "/login":
                        __WEBPACK_IMPORTED_MODULE_3__PagePresenter_js__["a" /* default */].showOnlyOnePage("login-page");
                        break;

                    // case "/info":
                    //     PagePresenter.showOnlyOnePage("info-page");
                    //     break;

                    default:
                        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.loginBtn.click();
                        break;
                }
                return Object(__WEBPACK_IMPORTED_MODULE_14__debugLog__["a" /* default */])("NOT AUTH");
            } else if (resp) {
                Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.signoutBtn.hidden = false;
                Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.loginBtn.hidden = true;
                Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().nav.loginBox.innerHTML = resp.username;

                // user org + group
                Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().saver = {};
                Object(__WEBPACK_IMPORTED_MODULE_15__saveUserMembership__["a" /* default */])(resp.member_of_groups);

                switch (pathname) {

                    case "/main":
                        __WEBPACK_IMPORTED_MODULE_3__PagePresenter_js__["a" /* default */].showOnlyOnePage("main-page");
                        break;

                    case "/office":
                        __WEBPACK_IMPORTED_MODULE_8__network_Requester__["a" /* default */].whoami((err, resp) => {
                            if (err) {
                                Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.loginBtn.click();
                                return Object(__WEBPACK_IMPORTED_MODULE_14__debugLog__["a" /* default */])("office error router");
                            }
                            Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().officePage.render();
                            __WEBPACK_IMPORTED_MODULE_3__PagePresenter_js__["a" /* default */].showOnlyOnePage("office-page");
                            return Object(__WEBPACK_IMPORTED_MODULE_14__debugLog__["a" /* default */])("office norm router");
                        });
                        break;

                    // case "/info":
                    //     PagePresenter.showOnlyOnePage("info-page");
                    //     break;

                    case "/course":
                        __WEBPACK_IMPORTED_MODULE_8__network_Requester__["a" /* default */].whoami((err, resp) => {
                            if (err) {
                                Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.loginBtn.click();
                                return Object(__WEBPACK_IMPORTED_MODULE_14__debugLog__["a" /* default */])("office error router");
                            }
                            if (Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().course_page_flag === true) {
                                __WEBPACK_IMPORTED_MODULE_3__PagePresenter_js__["a" /* default */].showOnlyOnePage("course-page");
                                Object(__WEBPACK_IMPORTED_MODULE_14__debugLog__["a" /* default */])("/course");
                            } else {
                                Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.officeBtn.click();
                                Object(__WEBPACK_IMPORTED_MODULE_14__debugLog__["a" /* default */])("undefined /course");
                            }
                            return Object(__WEBPACK_IMPORTED_MODULE_14__debugLog__["a" /* default */])("office norm router");
                        });
                        break;

                    case "/group":
                        __WEBPACK_IMPORTED_MODULE_3__PagePresenter_js__["a" /* default */].showOnlyOnePage("group-page");
                        break;

                    case "/play":
                        if (Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().gameManager.game_id === null) {
                            Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().officePage.render();
                            Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.officeBtn.click();
                            Object(__WEBPACK_IMPORTED_MODULE_14__debugLog__["a" /* default */])("NO GAME");
                        } else {
                            __WEBPACK_IMPORTED_MODULE_3__PagePresenter_js__["a" /* default */].showOnlyOnePage("play-page");
                            Object(__WEBPACK_IMPORTED_MODULE_14__debugLog__["a" /* default */])("YES GAME");
                        }
                        break;

                    case "/edit":
                        __WEBPACK_IMPORTED_MODULE_3__PagePresenter_js__["a" /* default */].showOnlyOnePage("edit-page");
                        break;

                    case "/teacher":
                        if (Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().gameManager.game_id === null) {
                            Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().officePage.render();
                            Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().btn.officeBtn.click();
                            Object(__WEBPACK_IMPORTED_MODULE_14__debugLog__["a" /* default */])("NO GAME");
                        } else {
                            __WEBPACK_IMPORTED_MODULE_3__PagePresenter_js__["a" /* default */].showOnlyOnePage("play-page-manage");
                            Object(__WEBPACK_IMPORTED_MODULE_14__debugLog__["a" /* default */])("YES GAME");
                        }
                        break;

                    default:
                        __WEBPACK_IMPORTED_MODULE_3__PagePresenter_js__["a" /* default */].showOnlyOnePage("office-page");
                        Object(__WEBPACK_IMPORTED_MODULE_0__globalBus_js__["a" /* default */])().officePage.render();
                        __WEBPACK_IMPORTED_MODULE_3__PagePresenter_js__["a" /* default */].showOnlyOnePage("office-page");
                        break;
                }
                return Object(__WEBPACK_IMPORTED_MODULE_14__debugLog__["a" /* default */])("NORM AUTH");
            }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Router;


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Page__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_network_Requester_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__quizCard__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_linkOnButtons__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_globalBus_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_debugLog__ = __webpack_require__(0);









class QuizzesDesk extends __WEBPACK_IMPORTED_MODULE_0__Page__["a" /* default */] {

    static newQuizCard() {
        return `<div id="card-row-1" class="row equal-height-col">
                    <div class="col-sm-4">
                        <div id="new-quiz" class="new-quiz card card-in-col bg-success">
                            <img class="card-img-top" src="img/add_quiz.png" alt="Card image cap">
                            <div class="card-body text-white">
                                <h5 class="card-title">Новая викторина</h5>
                                <hr>
                                <p class="card-text">Создание нового набора вопросов</p>
                            </div>
                        </div>
                    </div>
                </div>`
    }

    static redirectToQuiz(id) {
        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])(id);
        __WEBPACK_IMPORTED_MODULE_1__modules_network_Requester_js__["a" /* default */].getQuizById(id, (err, resp) => {
            if (err) {
                Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])(err);
            } else {
                Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("quiz " + id + " rendering");
                Object(__WEBPACK_IMPORTED_MODULE_4__modules_globalBus_js__["a" /* default */])().quizEditorPage.render(id, resp);
            }
        });
    }

    static renderNewQuizCard(quizzesDesk) {
        quizzesDesk.innerHTML = QuizzesDesk.newQuizCard();
        Object(__WEBPACK_IMPORTED_MODULE_3__modules_linkOnButtons__["a" /* default */])(
            {button: "new-quiz", nextPage: "edit-page", pagePath: "/edit"}
        );
        document.getElementById("new-quiz").addEventListener("click", () => {
            Object(__WEBPACK_IMPORTED_MODULE_4__modules_globalBus_js__["a" /* default */])().quizEditorPage.clearForm();
        });
        document.getElementById("new-quiz").hidden = true;
    }

    static render() {
        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("Quiz Desk");
        let quizzesDesk = document.getElementById("quizzes-desk");
        __WEBPACK_IMPORTED_MODULE_1__modules_network_Requester_js__["a" /* default */].quizzesOfUser((err, resp) => {
            quizzesDesk.innerHTML = "";
            QuizzesDesk.renderNewQuizCard(quizzesDesk);
            if (err) {
                return console.log(" error");
            }
            Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])(resp);
            console.log(resp);
            console.log(resp.tags);
            let cardsInRow = 1;
            let rowCount = 1;
            for (let i = 0; i < resp.length; i++) {
                if (cardsInRow === 3) {
                    cardsInRow = 0;
                    rowCount++;
                }
                if (rowCount === 1 && cardsInRow < 3) {
                    Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("first str");
                    let caCol = document.createElement('div');
                    // <div id="quiz-card-${id}" class="card quizzes-desk__quiz-card">
                    caCol.setAttribute("class", "col-sm-4");
                    let caBox = document.createElement('div');
                    caBox.setAttribute("id", `quiz-card-${resp[i].id}`);
                    caBox.setAttribute("class", "card quizzes-desk__quiz-card card-in-col");
                    caBox.innerHTML = Object(__WEBPACK_IMPORTED_MODULE_2__quizCard__["a" /* default */])(resp[i].title, resp[i].description, resp[i].version_date.split("T")[0], resp[i].tags);
                    caCol.appendChild(caBox);
                    document.getElementById("card-row-1").appendChild(caCol);
                    document.getElementById(`quiz-card-${resp[i].id}`).onclick = () => {
                        QuizzesDesk.redirectToQuiz(resp[i].id)
                    };
                    cardsInRow++;
                } else {
                    if (cardsInRow === 0) {
                        let newRow = document.createElement('div');
                        newRow.setAttribute("id", `card-row-${rowCount}`);
                        newRow.setAttribute("class", "row equal-height-col");
                        quizzesDesk.appendChild(newRow);
                        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("new row = ");
                        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])(newRow);
                    }
                    let caCol = document.createElement('div');
                    caCol.setAttribute("class", "col-sm-4");
                    let caBox = document.createElement('div');
                    caBox.setAttribute("id", `quiz-card-${resp[i].id}`);
                    caBox.setAttribute("class", "card quizzes-desk__quiz-card card-in-col");
                    caBox.innerHTML = Object(__WEBPACK_IMPORTED_MODULE_2__quizCard__["a" /* default */])(resp[i].title, resp[i].description, resp[i].version_date.split("T")[0], resp[i].tags);
                    caCol.appendChild(caBox);
                    document.getElementById(`card-row-${rowCount}`).appendChild(caCol);
                    document.getElementById(`quiz-card-${resp[i].id}`).onclick = () => {
                        QuizzesDesk.redirectToQuiz(resp[i].id)
                    };
                    cardsInRow++;
                }
            }
            document.getElementById("new-quiz").hidden = false;
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = QuizzesDesk;


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = quizCard;


const TAGS = [
    "программирование", "информатика", "математика", "английский", "физика",
    "история", "химия", "биология", "география", "литература", "русский"
];

const SRC = {
    "программирование" : "img/tags/infa.png",
    "информатика" : "img/tags/infa.png",
    "математика" : "img/tags/math.png",
    "английский" : "img/tags/eng.png",
    "физика" : "img/tags/phy.png",
    "история" : "img/tags/hist.png",
    "химия" : "img/tags/chem.png",
    "биология" : "img/tags/bio.png",
    "география" : "img/tags/geo.png",
    "литература" : "img/tags/lit.png",
    "русский" : "img/tags/lit.png"
};

function quizCard(title, description, date, tags) {
    console.log(tags);
    let find_index = -1;
    let src = "img/quiz_logo.png";
    for (let i = 0; i < tags.length; i++) {
        let tag = tags[i].toLowerCase().split(" ").join(""); // без пробелов
        find_index = TAGS.indexOf(tag);
        if (find_index !== -1) {
            src = SRC[TAGS[find_index]];
            break;
        }
    }
    return `<img class="card-img-top" src=${src} alt="Card image cap">
            <div class="card-body pointer">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${description}</p>
            </div>
            <div class="card-footer">
                <small class="text-muted">Дата изменения ${date}</small>
            </div>`
}


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_network_Requester_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_fieldsCleaner_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_debugLog__ = __webpack_require__(0);







const messagesProfileForm = {
    INCORRECT_MESSAGE : "Использованы недопустимые символы",
    SUCCESS_MESSAGE : "Данные изменены!"
};

class ProfileForm extends __WEBPACK_IMPORTED_MODULE_0__modules_FormValidator_js__["a" /* default */] {

    constructor() {
        super();
        Object.assign(ProfileForm.prototype, __WEBPACK_IMPORTED_MODULE_2__modules_fieldsCleaner_js__["a" /* default */]);
        this.nameValue = document.querySelector("#profile-name").value;
        this.emailValue = document.querySelector("#profile-email").value;
        this.passwordValue = document.querySelector("#profile-old-password").value;
        this.newPasswordValue = document.querySelector("#profile-new-password").value;
        this.newPasswordValueRepeat = document.querySelector("#profile-repeat-password").value;
        this.errorBox = null;
        this.addEventsToButtons();
        Object(__WEBPACK_IMPORTED_MODULE_3__modules_debugLog__["a" /* default */])("prof FORM");
    }

    static msgIncorrectInput() {
        return messagesProfileForm.INCORRECT_MESSAGE;
    }

    static msgSuccess() {
        return messagesProfileForm.SUCCESS_MESSAGE;
    }

    static validate(nameValue, emailValue, passwordValue, newPasswordValue, newPasswordValueRepeat) {
        return true;
    }

    setFormValues(resp) {
        this.clearFields(
            "profile-name",
            "profile-email",
            "profile-old-password",
            "profile-new-password",
            "profile-repeat-password",
            "profile-form-error"
        );
        Object(__WEBPACK_IMPORTED_MODULE_3__modules_debugLog__["a" /* default */])(this.nameValue + " " + resp.last_name);
        document.querySelector("#profile-name").value = resp.last_name;
        document.querySelector("#profile-email").value = resp.email;
    }

    sendRequest() {
        __WEBPACK_IMPORTED_MODULE_1__modules_network_Requester_js__["a" /* default */].changeUserData(this.nameValue, this.emailValue, (err, resp) => {
            if (err) {
                document.getElementById("profile-form-error").innerHTML = "patch err";
                return console.log("patch err");
            }
            this.setFormValues(resp);
            document.getElementById("profile-form-ok").innerHTML = ProfileForm.msgSuccess();
        });
    }

    sendRequestChangePswd() {
        __WEBPACK_IMPORTED_MODULE_1__modules_network_Requester_js__["a" /* default */].changePassword(this.passwordValue, this.newPasswordValue, (err, resp) => {
            if (err) {
                document.getElementById("profile-form-error").innerHTML = "pswd err";
                return console.log("pswd err");
            }
            document.getElementById("profile-form-ok").innerHTML = ProfileForm.msgSuccess();
        });
    }

    addEventsToButtons() {

        document.querySelector("#profile-form-btn").addEventListener("click", () => {
            this.nameValue = document.querySelector("#profile-name").value;
            this.emailValue = document.querySelector("#profile-email").value;
            this.passwordValue = document.querySelector("#profile-old-password").value;
            this.newPasswordValue = document.querySelector("#profile-new-password").value;
            this.newPasswordValueRepeat = document.querySelector("#profile-repeat-password").value;

            Object(__WEBPACK_IMPORTED_MODULE_3__modules_debugLog__["a" /* default */])("prof BTN");
            const valid = ProfileForm.validate(this.nameValue, this.emailValue, this.passwordValue, this.newPasswordValue, this.newPasswordValueRepeat);

            if (valid) {
                if (this.passwordValue !== "") {
                    if (this.newPasswordValue === this.newPasswordValueRepeat && this.newPasswordValue !== "") {
                        this.sendRequestChangePswd();
                        Object(__WEBPACK_IMPORTED_MODULE_3__modules_debugLog__["a" /* default */])("prof ch data");
                        this.sendRequest();
                    } else {
                        document.getElementById("profile-form-error").innerHTML = "Неверно повторили пароль";
                    }
                } else if (this.newPasswordValue !== "") {
                    document.getElementById("profile-form-error").innerHTML = "Введите старый пароль";
                } else {
                    this.sendRequest();
                }
            }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ProfileForm;



/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__globalBus__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AuthWorker__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__debugLog__ = __webpack_require__(0);






const WS_URL = "ws://api.keklik.xyz/?session_key=";
const TEACHER_ROLE = "teacher";
const STUDENT_ROLE = "student";

const ACTIONS = {
    "subscribe" : "subscribe",
    "join" : "join",
    "next_question" : "next_question",
    "check" : "check",
    "answer" : "answer",
    "finish" : "finish"
};

const STATE = {
    "answering" : "answering",
    "finish" : "finish"
};
class WsController {
    // передавать вид события
    constructor(role="unknown") {
        this.role = role;
        this.socket = null;
        this.create();
        this.addEvents();
    }

    create() {
        this.socket = new WebSocket(`${WS_URL}${__WEBPACK_IMPORTED_MODULE_1__AuthWorker__["a" /* default */].getSessionKey()}`);
    }

    addEvents() {
        this.socket.onopen = () => {
            Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("Соединение установлено");
            Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            if (this.role === TEACHER_ROLE) {
                this.subscribeTeacher(Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameManager.game_id);
            } else if (this.role === STUDENT_ROLE) {
                this.joinStudent(Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameManager.game_id);
                this.subscribeStudent(Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameManager.game_id);
            }
        };

        this.socket.onclose = (event) => {
            Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("Соединение закрыто");
            Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            // reload
        };

        this.socket.onmessage = (event) => {
            Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("Получено сообщение: " + event.data);
            Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            const ws_dataObj = JSON.parse(event.data);
            if (this.role === TEACHER_ROLE) {
                // рендерить только экшн next question и потом экшн answer
                if (ws_dataObj.payload.action === ACTIONS.next_question &&
                    ws_dataObj.payload.data.state !== STATE.finish) {
                    Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])(ws_dataObj.payload.data.current_question + "_TEACHER_____________________________");
                    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameTeacherPage.renderQuestion(ws_dataObj);
                } else if (ws_dataObj.payload.data.state === STATE.finish) {
                    Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("_________________FINISH___________________");
                    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameTeacherPage.renderFinish(ws_dataObj);
                    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameManager.reset();
                } else if (ws_dataObj.payload.action === ACTIONS.answer) {
                    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameTeacherPage.renderGameTable(ws_dataObj);
                } else if (ws_dataObj.payload.action === ACTIONS.join) {
                    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameTeacherPage.newJoin(ws_dataObj.payload.data.user.username);
                    Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("JOINED________________" + Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameManager.joined_counter);
                    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameTeacherPage.renderAnsweredCounter();
                    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameTeacherPage.renderJoinedCounter();
                }
            } else if (this.role === STUDENT_ROLE) {
                if (ws_dataObj.payload.action === ACTIONS.next_question &&
                ws_dataObj.payload.data.state !== STATE.finish) {
                    Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])(ws_dataObj.payload.data.current_question + "_STUDENT_____________________________");
                    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameStudentPage.renderQuestion(ws_dataObj);
                } else if (ws_dataObj.payload.action === ACTIONS.check &&
                    ws_dataObj.payload.data.state !== STATE.finish) {
                    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameStudentPage.renderAnswer(ws_dataObj);
                } else if (ws_dataObj.payload.action === ACTIONS.finish) {
                    Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("_________________FINISH___________________");
                    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameStudentPage.renderFinish(ws_dataObj);
                    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().gameManager.reset();
                }
            }
        };

        this.socket.onerror = (error) => {
            Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("Ошибка: " + error.message);
            Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            // reload
        };
    }

    joinStudent(game_id) {
        Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("SEND JOIN STUDENT");
        this.socket.send(JSON.stringify(
            {
                "stream": "games",
                "payload": {
                    "action": "join",
                    "pk": game_id
                }
            }));
    }

    subscribeTeacher(game_id) {
        Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("SEND SUBSCRIBE TEACHER");
        this.socket.send(JSON.stringify(
            {
                "stream": "games",
                "payload": {
                    "action": "subscribe",
                    "pk": game_id,
                "data": {
                    "action": "join"
                    }
                }
            }));
        this.socket.send(JSON.stringify(
            {
                "stream": "games",
                "payload": {
                "action": "subscribe",
                    "pk": game_id,
                "data": {
                    "action": "answer"
                    }
                }
            }));
    }

    subscribeStudent(game_id) {
        Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("Subscribe STUDENT");
        this.socket.send(JSON.stringify(
            {
                "stream": "games",
                "payload": {
                    "action": "subscribe",
                    "pk": game_id,
                    "data": {
                        "action": "next_question"
                    }
                }
            }));
        this.socket.send(JSON.stringify(
            {
                "stream": "games",
                "payload": {
                    "action": "subscribe",
                    "pk": game_id,
                    "data": {
                        "action": "check"
                    }
                }
            }));
        this.socket.send(JSON.stringify(
            {
                "stream": "games",
                "payload": {
                    "action": "subscribe",
                    "pk": game_id,
                    "data": {
                        "action": "finish"
                    }
                }
            }));
    }

    sendNextMessage(game_id) {
        Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("GAME ID in sending = " + game_id);
        this.socket.send(
            JSON.stringify({
            "stream": "games",
            "payload": {
                "action": "next_question",
                "pk": game_id
            }
        }));
    }

    sendTrueAnsForAll(game_id) {
        Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("GAME ID in sending = " + game_id);
        this.socket.send(
            JSON.stringify({
                "stream": "games",
                "payload": {
                    "action": "check",
                    "pk": game_id
                }
            }));
    }

    sendAnswerMessage(game_id, ans_var_index, cur_question_id) {
        Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("GAME ID in ANSWERING = " + game_id);
        this.socket.send(
            JSON.stringify({
                "stream": "games",
                "payload": {
                    "action": "answer",
                    "data": {
                        "answer": [ans_var_index],
                        "question": cur_question_id
                    },
                    "pk": game_id
                }
            }));
    }

    disconnect() {
        this.socket.close();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = WsController;



/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Page__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_network_Requester_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_linkOnButtons__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_globalBus_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__statisticItem__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_debugLog__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_network_AuthWorker__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__userGroupsByOrgId__ = __webpack_require__(9);











class StaticticTable extends __WEBPACK_IMPORTED_MODULE_0__Page__["a" /* default */] {

    static render(url="http://api.keklik.xyz/api/games/my/?limit=5&offset=0") {
        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("Statictic Table");
        let statDesk = document.getElementById("table-statistic");

        __WEBPACK_IMPORTED_MODULE_1__modules_network_Requester_js__["a" /* default */].getGameByUser(url, (err, resp) => {
            if (err) {
                Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("err load user games");
            } else {
                statDesk.innerHTML = "";
                let next_page = resp.next;
                let prev_page = resp.previous;
                resp = resp.results;
                if (resp.length === 0) {
                    statDesk.innerHTML = "<h3>Вы не провели ни одного соревнования</h3>";
                } else {
                    let content = "";
                    // до 10
                    let len = resp.length < 10 ? resp.length : 10;
                    for (let i = 0; i < len; i++) {
                        let game = resp[i];
                        content += Object(__WEBPACK_IMPORTED_MODULE_4__statisticItem__["a" /* default */])(game.id, game.quiz.title, game.created_at.split("T")[0],
                            game.group !== null ? game.group.organization.name : null,
                            game.group !== null ? game.group.name : null);
                    }

                    let paginator = `<nav aria-label="Page navigation example">
                                  <ul class="pagination justify-content-center">
                                    <li id="prev-page-statistic" class="page-item">
                                      <span class="page-link"><i class="fa fa-chevron-left" aria-hidden="true"></i></span>
                                    </li>
                                    <li id="next-page-statistic" class="page-item">
                                      <span class="page-link"><i class="fa fa-chevron-right" aria-hidden="true"></i></span>
                                    </li>
                                  </ul>
                                </nav>`;

                    statDesk.innerHTML = content + "<br>" + paginator;
                    for (let i = 0; i < len; i++) {
                        let game = resp[i];
                        document.getElementById(`statistic-xls-by-pin-${game.id}`)
                            .onclick = function() {open(`http://api.keklik.xyz/media/games/${game.id}/report`)};
                    }

                    if (next_page === null) {
                        document.getElementById("next-page-statistic").setAttribute('class','page-item disabled');
                    } else {
                        document.getElementById("next-page-statistic").setAttribute('class','page-item');
                        document.getElementById("next-page-statistic").onclick = () => {
                            StaticticTable.render(next_page);
                        }
                    }

                    if (prev_page === null) {
                        document.getElementById("prev-page-statistic").setAttribute('class','page-item disabled');
                    } else {
                        document.getElementById("prev-page-statistic").setAttribute('class','page-item');
                        document.getElementById("prev-page-statistic").onclick = () => {
                            StaticticTable.render(prev_page);
                        }
                    }
                }
            }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StaticticTable;


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = statisticItem;


function statisticItem(pin, quiz_name, game_date, org_name, group_name) {
    let content = "";
    if (org_name !== null || group_name !== null) {
        content = `<small class="mb-1 text-left"><u>Организация:</u> ${org_name}</small><br>
                   <small class="text-left"><u>Группа:</u> ${group_name}</small>`
    } else {
        content = `<small class="mb-1 text-left">&nbsp;</small><br>
                   <small class="text-left">&nbsp;</small>`
    }

    return `<div class="list-group-item  align-items-start">
                <div class="container">
                    <div class="text-left d-flex justify-content-between row">
                        <div class="col col-sm-9">
                            <h5 class="mb-1"><u>PIN </u>${pin} ${quiz_name}</h5>
                        </div>
                        <div class="col col-sm-3 text-right">
                            <small><u>Дата проведения:</u> ${game_date}</small>
                        </div>
                    </div>
                    <div class="text-left row">
                        <div class="col col-sm-9">
                            ${content}
                        </div>
                        <div class="col col-sm-3 text-right">
                            <button id=statistic-xls-by-pin-${pin} type="button" class="btn btn-sm btn-success btn-icon">
                                <i class="fa fa-file-excel-o" aria-hidden="true"></i> Отчет .xls
                            </button>                         
                        </div>
                    </div>
                </div>
            </div>`
}


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = questionBox;


function questionBox(index) {
    return (
        `<div class="edit-quiz-form__question-box" id="edit-quiz-form__question-box_${index}">
            <button id="delete-question-box_${index}" type="button" class="delete-question-box close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">×</span>
            </button>
            <h4 id=q_num_${index} class="q_num_span">Вопрос ${index + 1} <red>&nbsp;*</red></h4>
            <div class="input-group mb-3">
                <textarea class="edit-question form-control necessary-field" data-nec="true" aria-label="Описание..."></textarea>
            </div>

            <div class="row edit-quiz-form-ans-row">
                <div class="col">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Вариант 1<red>&nbsp;*</red></span>
                        </div>
                        <input type="text" class="edit-variant form-control necessary-field" data-nec="true" placeholder="" aria-label="" aria-describedby="basic-addon2">
                    </div>
                </div>
                <div class="col">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Вариант 2<red>&nbsp;*</red></span>
                        </div>
                        <input type="text" class="edit-variant form-control necessary-field" data-nec="true" placeholder="" aria-label="" aria-describedby="basic-addon2">
                    </div>
                </div>
            </div>
            <div class="row edit-quiz-form-ans-row">
                <div class="col">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Вариант 3</span>
                        </div>
                        <input type="text" class="edit-variant form-control" placeholder="" aria-label="" aria-describedby="basic-addon2">
                    </div>
                </div>
                <div class="col">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Вариант 4</span>
                        </div>
                        <input type="text" class="edit-variant form-control" placeholder="" aria-label="" aria-describedby="basic-addon2">
                    </div>
                </div>
            </div>
            <div class="row edit-quiz-form-ans-row">
                <div class="col">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Вариант 5</span>
                        </div>
                        <input type="text" class="edit-variant form-control" placeholder="" aria-label="" aria-describedby="basic-addon2">
                    </div>
                </div>
                <div class="col">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Вариант 6</span>
                        </div>
                        <input type="text" class="edit-variant form-control" placeholder="" aria-label="" aria-describedby="basic-addon2">
                    </div>
                </div>
            </div>
            <div class="row edit-quiz-form-ans-row">
                <div class="col">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Вариант 7</span>
                        </div>
                        <input type="text" class="edit-variant form-control" placeholder="" aria-label="" aria-describedby="basic-addon2">
                    </div>
                </div>
                <div class="col">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Вариант 8</span>
                        </div>
                        <input type="text" class="edit-variant form-control" placeholder="" aria-label="" aria-describedby="basic-addon2">
                    </div>
                </div>
            </div>
            <div class="row edit-quiz-form-ans-row">
                <div class="col">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-light text-success">Правильный вариант<red>&nbsp;*</red></span>
                        </div>
                        <input maxlength="1" type="number"  min="1" max="8" class="true-var edit-answer form-control necessary-field numeric-field" data-nec="true" placeholder="1" aria-label="" aria-describedby="basic-addon2">
                    </div>
                </div>
                <div class="col">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-light text-info">Очки за ответ<red>&nbsp;*</red></span>
                        </div>
                        <input maxlength="3" type="number" min="1" max="999" class="edit-points form-control necessary-field numeric-field" data-nec="true" placeholder="5" aria-label="" aria-describedby="basic-addon2">
                    </div>
                </div>
            </div>
            <hr>
        </div>`
    );
}

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = emptyQuizForm;


function emptyQuizForm() {
    return `<h3 id="quiz-editor-h3">Создание викторины</h3>
    
        <div id="target-group-box"></div>
        
        <div class="edit-quiz-box" id="edit-quiz-form">
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text">Название <red>&nbsp;*</red></span>
                </div>
                <textarea id="edit-quiz-form__title" class="form-control necessary-field" aria-label="Новая викторина..."></textarea>
            </div>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text">Описание <red>&nbsp;*</red></span>
                </div>
                <textarea id="edit-quiz-form__description" class="form-control necessary-field" aria-label="Описание..."></textarea>
            </div>

            <div class="input-group mb-3">
                <label>Метки викторины <red>&nbsp;*</red></label>
                <input id="edit-quiz-form__tags" class="form-control necessary-field" type="text" placeholder="Математика, Физика">
            </div>
            <hr>
            <br>
            <div id="edit-quiz-form__questions">
                <div class="edit-quiz-form__question-box" id="edit-quiz-form__question-box_0">
                    <h4>Вопрос 1<red>&nbsp;*</red></h4>
                    <div class="input-group mb-3">
                        <textarea class="edit-question form-control necessary-field" aria-label="Описание..."></textarea>
                    </div>

                    <div class="row edit-quiz-form-ans-row">
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Вариант 1<red>&nbsp;*</red></span>
                                </div>
                                <input type="text" class="edit-variant form-control necessary-field" placeholder="" aria-label="" aria-describedby="basic-addon2">
                            </div>
                        </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Вариант 2<red>&nbsp;*</red></span>
                                </div>
                                <input type="text" class="edit-variant form-control necessary-field" placeholder="" aria-label="" aria-describedby="basic-addon2">
                            </div>
                        </div>
                    </div>
                    <div class="row edit-quiz-form-ans-row">
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Вариант 3</span>
                                </div>
                                <input type="text" class="edit-variant form-control" placeholder="" aria-label="" aria-describedby="basic-addon2">
                            </div>
                        </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Вариант 4</span>
                                </div>
                                <input type="text" class="edit-variant form-control" placeholder="" aria-label="" aria-describedby="basic-addon2">
                            </div>
                        </div>
                    </div>
                    <div class="row edit-quiz-form-ans-row">
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Вариант 5</span>
                                </div>
                                <input type="text" class="edit-variant form-control" placeholder="" aria-label="" aria-describedby="basic-addon2">
                            </div>
                        </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Вариант 6</span>
                                </div>
                                <input type="text" class="edit-variant form-control" placeholder="" aria-label="" aria-describedby="basic-addon2">
                            </div>
                        </div>
                    </div>
                    <div class="row edit-quiz-form-ans-row">
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Вариант 7</span>
                                </div>
                                <input type="text" class="edit-variant form-control" placeholder="" aria-label="" aria-describedby="basic-addon2">
                            </div>
                        </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Вариант 8</span>
                                </div>
                                <input type="text" class="edit-variant form-control" placeholder="" aria-label="" aria-describedby="basic-addon2">
                            </div>
                        </div>
                    </div>
                    <div class="row edit-quiz-form-ans-row">
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-light text-success">Правильный вариант<red>&nbsp;*</red></span>
                                </div>
                                <input maxlength="1" type="number"  min="1" max="8" class="true-var edit-answer form-control necessary-field numeric-field" placeholder="1" aria-label="" aria-describedby="basic-addon2">
                            </div>
                        </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-light text-info">Очки за ответ<red>&nbsp;*</red></span>
                                </div>
                                <input maxlength="3" type="number"  min="1" max="999" class="edit-points form-control necessary-field numeric-field" placeholder="5" aria-label="" aria-describedby="basic-addon2">
                            </div>
                        </div>
                    </div>
                    <hr>
                </div>
            </div>
            <red id="edit-quiz-err"></red>
        </div>`
}

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Page_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_PagePresenter__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_globalBus__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_htmlEntities__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_debugLog__ = __webpack_require__(0);








class GameTeacherPage extends __WEBPACK_IMPORTED_MODULE_0__Page_js__["a" /* default */] {

    constructor() {
        super();
        this.addEventsOnButtons();
        Object(__WEBPACK_IMPORTED_MODULE_4__modules_debugLog__["a" /* default */])("teacher");
        this.addRedirectOnButtons(
            {button: "start-game-btn_clicker", nextPage: "play-page-manage", pagePath: "/teacher"},
            {button: "exit-game-btn", nextPage: "office-page", pagePath: "/office"}
        );
        document.getElementById("exit-game-btn").onclick = () => {
            Object(__WEBPACK_IMPORTED_MODULE_4__modules_debugLog__["a" /* default */])("OFFICE rerender");
            Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().btn.officeBtn.click();
        };
        this.game_table_answered = [];
        this.game_table_joined = [];
    }

    static pagePath() {
        return "/teacher";
    }

    static pageBoxName() {
        return "teacher-page";
    }

    attachRedirect() {
        this.prepareWaitingPlayers();
        Object(__WEBPACK_IMPORTED_MODULE_4__modules_debugLog__["a" /* default */])("add redirect");
    }

    addEventsOnButtons() {
        document.getElementById("next-question-btn").onclick = () => {
            document.getElementById("true-ans-box").innerHTML = "";
            Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.switchNext();
            document.getElementById("game-table-question").innerHTML = "";
            this.game_table_answered = [];
            document.getElementById("next-question-btn").setAttribute("disabled", "true");

            const nextButton = () => {
                document.getElementById("next-question-btn").removeAttribute("disabled");
            };
            setTimeout(nextButton, 1000);
        };

        document.getElementById("print-here-ans-btn").onclick = () => {
            let trueBox = document.getElementById("true-ans-box");
            trueBox.hidden = !trueBox.hidden;
            if (trueBox.hidden) {
                document.getElementById("print-here-ans-btn")
                    .querySelector("i").setAttribute('class', 'fa fa-eye')
            } else {
                document.getElementById("print-here-ans-btn")
                    .querySelector("i").setAttribute('class', 'fa fa-eye-slash')
            }
        };
        document.getElementById("print-here-table-btn").onclick = () => {
            let ansTable = document.getElementById("game-table-question");
            ansTable.hidden = !ansTable.hidden;
            if (ansTable.hidden) {
                document.getElementById("print-here-table-btn")
                    .querySelector("i").setAttribute('class', 'fa fa-eye')
            } else {
                document.getElementById("print-here-table-btn")
                    .querySelector("i").setAttribute('class', 'fa fa-eye-slash')
            }
        };
        document.getElementById("show-ans-btn").onclick = () => {
            Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.showTrueAnswer();
        };
    }

    prepareWaitingPlayers() {
        this.game_table_answered = [];
        this.game_table_joined = [];
        document.getElementById("game-diagram-1").hidden = true;
        document.getElementById("game-diagram-2").hidden = true;
        document.getElementById("exit-game-btn").hidden = true;

        document.getElementById("print-here-ans-btn").hidden = true;
        document.getElementById("print-here-table-btn").hidden = true;
        document.getElementById("show-ans-btn").hidden = true;

        document.getElementById("question-preview").innerHTML = "";
        document.getElementById("next-question-btn").innerHTML = "Запустить соревнование >>";
        document.getElementById("answered-counter").hidden = true;
        document.getElementById("joined-counter").hidden = false;
        document.getElementById("game-table").hidden = true;
        this.renderJoinedCounter();
        this.renderAnsweredCounter();
    }

    prepareGameMode() {
        document.getElementById("next-question-btn").innerHTML = "Следующий вопрос >>";
        document.getElementById("joined-counter").hidden = true;
        document.getElementById("answered-counter").hidden = false;
        document.getElementById("game-table").hidden = false;
        document.getElementById("print-here-ans-btn").hidden = false;
        document.getElementById("print-here-table-btn").hidden = false;
        document.getElementById("show-ans-btn").hidden = false;
    }

    renderQuestion(ws_dataObj) {
        document.getElementById("question-preview").innerHTML =
            "<u>Вопрос "+
            ws_dataObj.payload.data.current_question.number + "/<b>" +
            ws_dataObj.payload.data.quiz.questions.length + "</b>" + ":</u> " +
            Object(__WEBPACK_IMPORTED_MODULE_3__modules_htmlEntities__["a" /* default */])(ws_dataObj.payload.data.current_question.question);

        let game_data = ws_dataObj.payload.data;
        let true_id = game_data.current_question.answer[0];
        let ans = "";
        game_data.current_question.variants.forEach((elem) => {
            if (elem.id === true_id) {
                ans = elem.variant;
            }
        });
        document.getElementById("true-ans-box").innerHTML = `<u>Правильный ответ:</u> ${ans}`;
    }

    renderQuizNum(game_id) {
        document.getElementById("game-num").innerHTML = `Ход соревнования ${game_id}`;
        document.getElementById("next-question-btn").hidden = false;
    }

    renderAnsweredCounter() {
        document.getElementById("answered-counter").querySelector("ans").innerHTML =
            Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.answered_counter.toString();
        document.getElementById("answered-counter").querySelector("all").innerHTML =
            Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.joined_counter.toString();
    }

    renderJoinedCounter() {
        document.getElementById("joined-counter").querySelector("all").innerHTML =
            Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.joined_counter.toString();
    }

    renderGameTable(ws_gameObj) {
        let data = ws_gameObj.payload.data;
        Object(__WEBPACK_IMPORTED_MODULE_4__modules_debugLog__["a" /* default */])("DATA = " + data);
        let ansUser = data.player.user.username;
        if (data.player.user.last_name !== "") {
            ansUser = data.player.user.last_name;
        }
        Object(__WEBPACK_IMPORTED_MODULE_4__modules_debugLog__["a" /* default */])("ОТВЕТИЛ " + ansUser);

        Object(__WEBPACK_IMPORTED_MODULE_4__modules_debugLog__["a" /* default */])(this.game_table_answered);
        Object(__WEBPACK_IMPORTED_MODULE_4__modules_debugLog__["a" /* default */])(this.game_table_answered.indexOf(ansUser.toString()));

        Object(__WEBPACK_IMPORTED_MODULE_4__modules_debugLog__["a" /* default */])("answered_counter до if =>" + Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.answered_counter);

        if (this.game_table_answered.indexOf(ansUser.toString()) === -1) {
            // индикатор сколько ответило
            Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.answered_counter += 1;
            Object(__WEBPACK_IMPORTED_MODULE_4__modules_debugLog__["a" /* default */])("answered_counter += 1 =>" + Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.answered_counter);
            this.renderAnsweredCounter();

            this.game_table_answered.push(ansUser.toString());

            if (data.correct === true) {
                document.getElementById("game-table-question").innerHTML +=
                    `<tr class="line-result-table table-group-line right-ans">
                    <th scope="row">${Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.answered_counter}</th>
                    <td>${Object(__WEBPACK_IMPORTED_MODULE_3__modules_htmlEntities__["a" /* default */])(ansUser)}</td>
                    <td>${Object(__WEBPACK_IMPORTED_MODULE_3__modules_htmlEntities__["a" /* default */])(data.answer[0].variant)}</td>
            </tr>`
            } else {
                document.getElementById("game-table-question").innerHTML +=
                    `<tr class="line-result-table table-group-line">
                    <th scope="row">${Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.answered_counter}</th>
                    <td>${Object(__WEBPACK_IMPORTED_MODULE_3__modules_htmlEntities__["a" /* default */])(ansUser)}</td>
                    <td>${Object(__WEBPACK_IMPORTED_MODULE_3__modules_htmlEntities__["a" /* default */])(data.answer[0].variant)}</td>
            </tr>`
            }
        }
    }

    newJoin(username) {
        if (this.game_table_joined.indexOf(username.toString()) === -1) {
            this.game_table_joined.push(username);
            Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.joined_counter += 1;
        }
    }

    countAllAnswers(ws_dataObj){
        let answers_count = {};
        answers_count.all = 0;
        answers_count.right = 0;
        answers_count.all_points = 0;
        answers_count.right_points = 0;

        let data = ws_dataObj.payload.data;
        let len_quiz = data.generated_questions.length;
        for (let i = 0; i < len_quiz; i++) {
            let gen_question = data.generated_questions[i];
            let len_players_ans = gen_question.players_answers.length;
            answers_count.all += len_players_ans;
            for (let k = 0; k < len_players_ans; k++) {
                answers_count.all_points += gen_question.points; // с каждым ответившим увеличиваем правильные очки
                if (gen_question.players_answers[k].correct === true) {
                    answers_count.right += 1;
                    answers_count.right_points += gen_question.points;
                }
            }
        }
        Object(__WEBPACK_IMPORTED_MODULE_4__modules_debugLog__["a" /* default */])(answers_count);
        return answers_count;
    }

    renderFinish(ws_dataObj) {
        let game_data = ws_dataObj.payload.data;

        document.getElementById("print-here-ans-btn").hidden = true;
        document.getElementById("print-here-table-btn").hidden = true;
        document.getElementById("show-ans-btn").hidden = true;
        // считаем соотношение ответов
        let all_ans_countObj = this.countAllAnswers(ws_dataObj);
        let all_ans_len = 0;
        let right_ans_len = 0;
        all_ans_len = all_ans_countObj.all;
        right_ans_len = all_ans_countObj.right;

        function okruglen_to_2(n) {
            return parseFloat(n.toFixed(2));
        }

        let right_proc = 0;
        right_proc = okruglen_to_2((right_ans_len/all_ans_len) * 100);
        let fail_proc = 0;
        fail_proc = 100 - right_proc;

        document.getElementById("game-diagram-1").hidden = false;
        document.getElementById("game-diagram-2").hidden = false;
        document.getElementById("exit-game-btn").hidden = false;
        let chart_1 = new CanvasJS.Chart("game-diagram-1", {
            theme: "light1",
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Общий итог"
            },
            data: [{
                type: "pie",
                startAngle: 25,
                toolTipContent: "<b>{label}</b>: {y}%",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} - {y}%",
                dataPoints: [
                    { y: right_proc, label: "Правильных ответов" },
                    { y: fail_proc, label: "Неправильных ответов" },
                ]
            }]
        });

        let right_score = all_ans_countObj.right_points;
        let all_score = all_ans_countObj.all_points;

        let ok_score_proc = okruglen_to_2((right_score/all_score) * 100);
        let fail_score_proc = 100 - ok_score_proc;
        let chart_2 = new CanvasJS.Chart("game-diagram-2", {
            theme: "light1",
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Статистика по баллам"
            },
            data: [{
                type: "pie",
                startAngle: 25,
                toolTipContent: "<b>{label}</b>: {y}%",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} - {y}%",
                dataPoints: [
                    { y: ok_score_proc, label: "Полученные баллы" },
                    { y: fail_score_proc, label: "Потерянные баллы" },
                ]
            }]
        });
        chart_1.render();
        chart_2.render();
        let pin = game_data.id;
        document.getElementById("question-preview").innerHTML =
            `Соревнование завершено 
                    <button id=xls-by-pin-${pin} type="button" class="btn btn-sm btn-success btn-icon">
                        <i class="fa fa-file-excel-o" aria-hidden="true"></i> Отчет .xls
                    </button>`;
        document.getElementById(`xls-by-pin-${pin}`).onclick = function() {open(`http://api.keklik.xyz/media/games/${pin}/report`)};

        document.getElementById("next-question-btn").hidden = true;
        document.getElementById("answered-counter").hidden = true;
        document.getElementById("joined-counter").hidden = true;
        document.getElementById("game-table").hidden = true;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameTeacherPage;


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Page_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_PagePresenter__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_globalBus__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_network_AuthWorker__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_htmlEntities__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_debugLog__ = __webpack_require__(0);









class GameStudentPage extends __WEBPACK_IMPORTED_MODULE_0__Page_js__["a" /* default */] {

    constructor() {
        super();
        this.addEventsOnButtons();
        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("student")
    }

    static pagePath() {
        return "/play";
    }

    static pageBoxName() {
        return "play-page";
    }

    attachRedirect() {
        this.addRedirectOnButtons(
            {button: "join-game-btn_clicker", nextPage: "play-page", pagePath: "/play"},
            {button: "exit-game-student-btn", nextPage: "office-page", pagePath: "/office"}
        );
        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("add redirect");
    }

    renderQuestion(ws_dataObj) {
        document.getElementById("figure-box").hidden = false;
        document.getElementById("play-page-question").innerHTML = "";
        document.getElementById("play-page-header").innerHTML =
            "Соревнование " +
            ws_dataObj.payload.data.id + ": " +
            ws_dataObj.payload.data.quiz.title;
        document.getElementById("play-page-question").innerHTML =
            "Вопрос "+
            ws_dataObj.payload.data.current_question.number + "/<b>" +
            ws_dataObj.payload.data.quiz.questions.length + "</b>" + ": " +
            Object(__WEBPACK_IMPORTED_MODULE_4__modules_htmlEntities__["a" /* default */])(ws_dataObj.payload.data.current_question.question);
        let cur_question_id = ws_dataObj.payload.data.current_question.id;
        let answersLen = ws_dataObj.payload.data.current_question.variants.length;
        document.getElementById("play-page-ans-list").innerHTML = "";
        for (let i = 0; i < answersLen; i++){
            let variant_id = ws_dataObj.payload.data.current_question.variants[i].id;
            let varientInList = document.createElement('a');
            varientInList.setAttribute("class", "ans-variant list-group-item list-group-item-action list-group-item-info");
            varientInList.setAttribute("id", `ans-btn-${variant_id}`);
            document.getElementById("play-page-ans-list").appendChild(varientInList);
            document.getElementById(`ans-btn-${variant_id}`).innerHTML =
                Object(__WEBPACK_IMPORTED_MODULE_4__modules_htmlEntities__["a" /* default */])(ws_dataObj.payload.data.current_question.variants[i].variant);
            document.getElementById(`ans-btn-${variant_id}`).onclick = () => {
                Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("______________click______________");
                Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.sendAnswer(variant_id, cur_question_id);
            }
        }
    }

    renderWaitingStart() {
        document.getElementById("exit-game-student-btn").hidden = true;
        document.getElementById("play-page-header").innerHTML =
            `Ожидание старта соревнования ${Object(__WEBPACK_IMPORTED_MODULE_2__modules_globalBus__["a" /* default */])().gameManager.game_id}...`;
        document.getElementById("play-page-question").innerHTML = "";
        document.getElementById("play-page-ans-list").innerHTML = "";
        document.getElementById("play-figure").hidden = true;
        document.getElementById("play-figure").setAttribute("src", "");
        document.getElementById("figure-box").hidden = true;
    }

    renderWaitingNext() {
        document.getElementById("play-page-header").innerHTML =
            '<i class="fa fa-check-square-o" aria-hidden="true"></i>'+ " Ответ принят";
        // вопрос оставляем
        // document.getElementById("play-page-question").innerHTML = "";
        document.getElementById("play-page-ans-list").innerHTML = "";
    }

    renderAnswer(ws_dataObj) {
        document.getElementById("play-page-ans-list").innerHTML = "";
        let game_data = ws_dataObj.payload.data;
        let true_id = game_data.answer[0];
        let ans = "";
        game_data.variants.forEach((elem) => {
            if (elem.id === true_id) {
                ans = elem.variant;
            }
        });
        Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])(ans);
        document.getElementById("play-page-ans-list").innerHTML =
            `<br><h5 class="text-left text-success">
                    <i class="fa fa-hand-o-right" aria-hidden="true"></i>
                    <u>Правильный ответ:</u> ${ans}
                </h5>`;
    }

    renderFinish(ws_dataObj) {
        document.getElementById("play-page-question").innerHTML = "";
        document.getElementById("exit-game-student-btn").hidden = false;
        let data = ws_dataObj.payload.data;
        let max_score = 0;
        let person_score = 0;
        let len_quiz = data.generated_questions.length;
        for (let i = 0; i < len_quiz; i++) {
            let gen_question = data.generated_questions[i];
            max_score += gen_question.points;
            let len_players_ans = gen_question.players_answers.length;
            for (let k = 0; k < len_players_ans; k++) {
                if (gen_question.players_answers[k].player.user.username === __WEBPACK_IMPORTED_MODULE_3__modules_network_AuthWorker__["a" /* default */].getUsername() &&
                    gen_question.players_answers[k].correct === true) {
                    Object(__WEBPACK_IMPORTED_MODULE_5__modules_debugLog__["a" /* default */])("USER NAME = " + __WEBPACK_IMPORTED_MODULE_3__modules_network_AuthWorker__["a" /* default */].getUsername());
                    person_score += gen_question.points;
                }
            }
        }
        document.getElementById("play-page-header").innerHTML =
            `Соревнование завершено`;
        document.getElementById("play-page-question").innerHTML =
            `<h3 class="text-center text-white bg-success game-result-header">
                Ваш результат <br>${person_score} из ${max_score}
            </h3>`;
        document.getElementById("play-page-ans-list").innerHTML = "";
        document.getElementById("play-figure").setAttribute("src", "img/finish_flag_700.jpg");
        document.getElementById("play-figure").hidden = false;
    }

    addEventsOnButtons() {

    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameStudentPage;


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_globalBus__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_debugLog__ = __webpack_require__(0);





class ModalWindow {
    constructor() {
        Object(__WEBPACK_IMPORTED_MODULE_0__modules_globalBus__["a" /* default */])().modalWindow = this;
        this.modalWind = document.getElementById("modal-window");
        this.headerBox = document.getElementById("modal-header-box");
        this.bodyBox = document.getElementById("modal-body-box");
        this.okBtn = document.getElementById("ok-delete-btn");
        this.cancelBtn = document.getElementById("cancel-delete-btn");
        this.closeBtn = document.getElementById("close-delete-btn");
    }

    clickOk(func) {
        this.okBtn.onclick = () => {
            Object(__WEBPACK_IMPORTED_MODULE_1__modules_debugLog__["a" /* default */])("OK");
            func();
            this.hide();
        };
    }

    clickCancel() {
        this.cancelBtn.onclick = () => {
            Object(__WEBPACK_IMPORTED_MODULE_1__modules_debugLog__["a" /* default */])("ОТМЕНА");
            this.hide();
        };
        this.closeBtn.onclick = () => {
            Object(__WEBPACK_IMPORTED_MODULE_1__modules_debugLog__["a" /* default */])("ЗАКРЫТЬ");
            this.hide();
        }
    }

    addEventsOnButtons(func) {
        Object(__WEBPACK_IMPORTED_MODULE_1__modules_debugLog__["a" /* default */])("modal click");
        this.clickOk(func);
        this.clickCancel();
    }

    setHeader(data) {
        this.headerBox.innerHTML = data;
    }

    setBody(data) {
        this.bodyBox.innerHTML = data;
    }

    show() {
        this.modalWind.setAttribute('class', 'modal fade show');
        this.modalWind.setAttribute('style', 'display: block');
    }

    hide() {
        this.modalWind.setAttribute('class', 'modal fade');
        this.modalWind.setAttribute('style', 'display: none');
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ModalWindow;


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = saveUserMembership;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__globalBus__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__debugLog__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__network_Requester__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__network_AuthWorker__ = __webpack_require__(5);







function saveUserMembership(member_of_groups) {
    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userGroups = member_of_groups;
    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userTeacherGroups = [];
    Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])(member_of_groups);
    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userOrg = [];
    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userTeacherOrg = [];
    let group_len = Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userGroups.length;

    for (let i = 0; i < group_len; i++) {
        if (Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userGroups[i].role === "teacher") {
            Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])("@@@@@@@@___________teacher");
            Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userGroups[i]);
            Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userTeacherGroups.push(Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userGroups[i].group);
            Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userTeacherGroups);
        }
        Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])(">>>>>>>>>>>>>>");
        Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userGroups[i].group.organization);
        let orgIdInArr = false;
        let org_len =  Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userOrg.length;
        for (let j = 0; j < org_len; j++) {
            if (Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userOrg[j].id === Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userGroups[i].group.organization.id) {
                orgIdInArr = true;
            }
        }
        if (!orgIdInArr) { // если такой организации еще нет, то добавляем
            Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userOrg.push(
                Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userGroups[i].group.organization
            );
        }

        if (Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userGroups[i].role === "teacher") {
            let orgTeacherIdInArr = false;
            let org_teacher_len = Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userTeacherOrg.length;
            for (let j = 0; j < org_teacher_len; j++) {
                if (Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userTeacherOrg[j].id === Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userGroups[i].group.organization.id) {
                    orgTeacherIdInArr = true
                }
            }
            if (!orgTeacherIdInArr) { // если такой организации учителя еще нет, то добавляем
                Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userTeacherOrg.push(
                    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userGroups[i].group.organization
                );
            }
        }
    }

    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userRunningGames = [];

    Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])("__________________ORG =");
    Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userOrg);
    Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])("__________________TEACHER ORG =");
    Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userTeacherOrg);
    Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])("__________________GROUP =");
    Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userGroups);
    Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])("__________________TEACHER GROUP =");
    Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().saver.userTeacherGroups);
}

/***/ })
/******/ ]);