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
        this.index = 2; // номер вопроса
        console.log("Quiz editor");
        this.quiz = {};
        this.editQuiz();
    }

    editQuiz() {
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
            document.getElementById("edit-quiz-form").querySelector("#edit-quiz-form__tags").value;

        let qBoxes = document.getElementsByClassName("edit-quiz-form__question-box");
        for (let i = 0; i < qBoxes.length; i++) {
            let variants = [];
            let qVariants = qBoxes[i].getElementsByClassName("edit-variant");
            let variantsNum = qVariants.length;
            for (let k = 0; k < variantsNum; k++) {
                variants.push({
                    variant: qVariants[k].value.toString()
                });
            }
            this.quiz.questions.push({
                number: i + 1,
                type: "single",
                question: qBoxes[i].querySelector(".edit-question").value.toString(),
                variants: variants,
                answer: parseInt(qBoxes[i].querySelector(".edit-answer").value),
                points: parseInt(qBoxes[i].querySelector(".edit-points").value),
            });
        }

        console.log(this.quiz);
    }

    static validate() {

    }

    sendRequest() {

    }

    addEventsOnButtons() {
        document.getElementById("edit-quiz-form__add-question-btn").onclick = () => {
            this.addQuestion();
        };

        document.getElementById("edit-quiz-form__send-btn").onclick = () => {

            this.pushToQuiz();
            QuizEditorPage.validate();

            if (QuizEditorPage.validate()) {
                this.sendRequest();
            }
        }
    }
}