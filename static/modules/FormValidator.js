import debugLog from "./debugLog";
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

    static hasDuplicates(array) {
        debugLog(array);
        for (let i = 0; i < array.length; ++i) {
            for (let j = i + 1; j < array.length; j++) {
                debugLog("i = " + i + "; " + j + " = " + array[i].variant + "; " + array[j].variant);
                if (array[i].variant === array[j].variant) {
                    return true;
                }
            }
        }
        return false;
    }

    static correctQuiz(quiz) {
        debugLog(quiz);
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
            debugLog(necessary_fields[i]);
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
