"use strict";

const messagesToForm = {
    OK_MESSAGE: "ok",
    EMPTY_MESSAGE : "empty",
    INCORRECT_MESSAGE : "incorrect",
};

export default class FormValidator {

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
        const loginRegexp = /^[\w\d]{3,10}$/;
        return (loginRegexp.test(login)) ? FormValidator.responseOk() : FormValidator.responseIncorrect();
    }

    static correctPassword(password) {
        if (!password) {
            return FormValidator.responseEmpty();
        }
        // const passwordRegexp = /\S{3,16}$/;
        const passwordRegexp = /^[\w\d]{3,10}$/;
        return (passwordRegexp.test(password)) ? FormValidator.responseOk() : FormValidator.responseIncorrect();
    }

    static correctQuiz(quiz) {
        console.log(quiz);
        let errors = [];
        if (quiz.title === "") errors.push("title_empty");
        if (quiz.description === "") errors.push("description_empty");
        if (quiz.tags === "") errors.push("tags_empty");
        quiz.questions.forEach((elem, i) => {
            if (elem.question === "") errors.push(i + "_question_empty");
            if (elem.answer.toString() === "NaN") errors.push(i + "_answer_empty");
            if (elem.points.toString === "NaN") errors.push(i + "_points_empty");
            let variants = elem.variants.filter((variant) => {
                return variant !== ""
            });
            if (variants < 2) errors.push(i + "_variants_empty");
        });
        return errors;
    }
}