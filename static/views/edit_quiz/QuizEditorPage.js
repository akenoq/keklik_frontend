"use strict";

import FormValidator from "../../modules/FormValidator.js";
import globalBus from "../../modules/globalBus.js";
import Requester from "../../modules/network/Requester.js";
import fieldsCleaner from "./../../modules/fieldsCleaner.js";
import PagePresenter from "../../modules/PagePresenter";
import Page from "../Page";
import questionBox from "./questionBox";

export default class QuizEditorPage extends Page {
    constructor() {
        super();
        this.index = 1; // номер вопроса
        console.log("Quiz editor");
        this.quiz = {};
        this.resetQuiz();
    }

    resetQuiz() {
        this.quiz = {
            title: "",
            description: "",
            tags: "",
            questions: []
        }
    }

    addQuestion() {
        let qBox = document.createElement('div');
        qBox.innerHTML = questionBox(this.index);
        document.getElementById("edit-quiz-form__questions").appendChild(qBox);
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

        console.log(this.quiz);
    }

    validate() {
        let errors = FormValidator.correctQuiz(this.quiz);
        console.log("err = " + errors);
        return true;
    }

    sendRequest() {
        Requester.quizEdit(this.quiz, (err, resp) => {
            if (err) {
                return console.log("err in quiz");
            }
            console.log("ok in quiz" + resp);
            document.getElementById("nav-office-btn").click();
        });
    }

    addEventsOnButtons() {
        document.getElementById("edit-quiz-form__add-question-btn").onclick = () => {
            this.addQuestion();
        };

        document.getElementById("edit-quiz-form__send-btn").onclick = () => {

            this.pushToQuiz();

            if (this.validate()) {
                this.sendRequest();
                this.resetQuiz();
            }
        };
    }
}