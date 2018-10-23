"use strict";

import FormValidator from "../../modules/FormValidator.js";
import globalBus from "../../modules/globalBus.js";
import Requester from "../../modules/network/Requester.js";
import fieldsCleaner from "./../../modules/fieldsCleaner.js";
import PagePresenter from "../../modules/PagePresenter";
import Page from "../Page";
import questionBox from "./questionBox";
import emptyQuizForm from "./emptyQuizForm";

export default class QuizEditorPage extends Page {
    constructor() {
        super();
        this.index = 1; // номер вопроса
        console.log("Quiz editor");
        this.quiz = {};
        this.resetQuiz();
        globalBus().quizEditorPage = this;

        this.editQuizById = false;
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
        if (this.editQuizById !== false) {
            Requester.quizEdit(this.editQuizById, this.quiz, (err, resp) => {
                if (err) {
                    return console.log("err in quiz");
                } else {
                    console.log("ok in quiz edit" + resp);
                    globalBus().btn.officeBtn.click();
                    this.editQuizById = false;
                }
            });
        } else {
            Requester.quizNew(this.quiz, (err, resp) => {
                if (err) {
                    return console.log("err in quiz");
                }
                console.log("ok in quiz" + resp);
                globalBus().btn.officeBtn.click();
            });
        }
    }

    startQuizBtn(resp) {
        let startGameBtn = document.createElement('button');
        startGameBtn.innerHTML = "Запуcтить";
        startGameBtn.setAttribute("id", "start-game-btn");
        startGameBtn.setAttribute("class", "btn btn-success start-btn");
        document.getElementById("quiz-editor-h3").appendChild(startGameBtn);
        globalBus().gameManager.joined_counter = 0;
        globalBus().gameTeacherPage.attachRedirect();
        startGameBtn.addEventListener("click", () => {
            globalBus().gameManager.start(this.editQuizById, resp.title);
        });
    }

    render(id, resp) {
        document.getElementById("new-quiz").click();
        console.log("ID = " + id);
        this.editQuizById = id;
        // добавить id викторины в заголовок
        document.getElementById("quiz-editor-h3").innerHTML = `Викторина ${this.editQuizById}`;
        // кнопка запуска викторины
        this.startQuizBtn(resp);
        document.getElementById("edit-quiz-form").querySelector("#edit-quiz-form__title").value =
            resp.title;
        document.getElementById("edit-quiz-form").querySelector("#edit-quiz-form__description").value =
            resp.description;
        document.getElementById("edit-quiz-form").querySelector("#edit-quiz-form__tags").value =
            resp.tags.join();
        // количество вопросов
        let questionsCount = resp.questions.length;
        console.log("questionsCount" + questionsCount);
        // генерирую под них боксы
        for (let i = 0; i < questionsCount - 1; i++) {
            this.index = i + 1;
            this.addQuestion();
        }
        // коллекция боксов
        let qBoxes = document.getElementsByClassName("edit-quiz-form__question-box");
        // бежим по ней
        for (let i = 0; i < questionsCount; i++) {
            qBoxes[i].querySelector(".edit-question").value = resp.questions[i].question;
            let variantsResp = resp.questions[i].variants;
            let variantsNum = resp.questions[i].variants.length;
            let variantEdit = qBoxes[i].getElementsByClassName("edit-variant");
            for (let k = 0; k < variantsNum; k++) {
                variantEdit[k].value = variantsResp[k].variant;
            }
            qBoxes[i].querySelector(".edit-answer").value = resp.questions[i].answer;
            qBoxes[i].querySelector(".edit-points").value = resp.questions[i].points;
        }
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

    clearForm() {
        console.log("clear form");
        this.editQuizById = false;
        console.log(this.editQuizById);
        document.querySelector(".edit-page__form").innerHTML = "";
        document.querySelector(".edit-page__form").innerHTML = emptyQuizForm();
        this.index = 1;
    }
}