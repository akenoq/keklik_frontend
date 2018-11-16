"use strict";

import FormValidator from "../../modules/FormValidator.js";
import globalBus from "../../modules/globalBus.js";
import Requester from "../../modules/network/Requester.js";
import fieldsCleaner from "./../../modules/fieldsCleaner.js";
import PagePresenter from "../../modules/PagePresenter";
import Page from "../Page";
import questionBox from "./questionBox";
import emptyQuizForm from "./emptyQuizForm";
import debugLog from "../../modules/debugLog";
import OrganizationDesk from "../office/organizations/OrganizationDesk";

export default class QuizEditorPage extends Page {
    constructor() {
        super();
        this.index = 1; // номер вопроса
        debugLog("Quiz editor");
        this.quiz = {};
        this.resetQuiz();
        globalBus().quizEditorPage = this;

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
        debugLog("INDEX = " + i);
        i = document.getElementsByClassName("edit-quiz-form__question-box").length;
        debugLog("INDEX+ = " + i);
        let qBox = document.createElement('div');
        qBox.innerHTML = questionBox(i);
        document.getElementById("edit-quiz-form__questions").appendChild(qBox);
        document.getElementById(`delete-question-box_${i}`).onclick = () => {
            this.deleteQuestion(i);
            debugLog(i);
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

        debugLog(this.quiz);
    }

    validate() {
        let errors = FormValidator.correctQuiz(this.quiz);
        debugLog("err = " + errors);
        if (errors.length !== 0) {
            debugLog("__________________________________");
            // document.getElementById("edit-quiz-err").innerHTML = "Обязательные поля не заполнены или заполнены с ошибками";
            document.getElementById("edit-quiz-err").innerHTML = errors.join('<br>');
            return false;
        }
        return true;
    }

    sendRequest() {
        if (this.editQuizById !== false) {
            Requester.quizEdit(this.editQuizById, this.quiz, (err, resp) => {
                if (err) {
                    document.getElementById("edit-quiz-err").innerHTML = "&#9888; Обязательные поля не заполнены или заполнены с ошибками";
                    return debugLog("err in quiz");
                } else {
                    debugLog("ok in quiz edit" + resp);
                    globalBus().btn.officeBtn.click();
                    this.editQuizById = false;
                }
            });
        } else {
            Requester.quizNew(this.quiz, (err, resp) => {
                if (err) {
                    document.getElementById("edit-quiz-err").innerHTML = "&#9888; Обязательные поля не заполнены или заполнены с ошибками";
                    return debugLog("err in quiz");
                }
                debugLog("ok in quiz" + resp);
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
            debugLog("ID = " + this.target_group_id);
            document.getElementById("start-game-btn_clicker").click();
            globalBus().gameManager.start(this.editQuizById, resp.title, this.target_group_id);
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
                <button id="selected-group" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
                debugLog("change selected-org text");
                document.getElementById("selected-org").innerHTML = organizations[i].name;
                this.renderListGroupByOrg(organizations[i].id);
            }
        }
    }

    renderListGroupByOrg(org_id) {
        let groups = [];
        let len_groups = globalBus().saver.userTeacherGroups.length;
        for (let i = 0; i < len_groups; i++) {
            if (globalBus().saver.userTeacherGroups[i].organization.id === org_id) {
                groups.push(globalBus().saver.userTeacherGroups[i]);
            }
        }
        debugLog(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        debugLog(groups);
        let groups_len = groups.length;
        let listGroupBtn = document.getElementById("list-group-btn");
        listGroupBtn.innerHTML = "";
        document.getElementById("selected-group").innerHTML = "Выберите группу...";
        this.target_group_id = null;

        for (let i = 0; i < groups_len; i++) {
            debugLog(groups[i]);
            debugLog("________________________");
            debugLog(listGroupBtn);
            let a = document.createElement('a');
            a.setAttribute('class', 'dropdown-item');
            listGroupBtn.appendChild(a);
            a.innerHTML = groups[i].name;
            debugLog(groups[i].name);
            a.setAttribute('id', `select-group-by-id-${groups[i].id}`);
            a.onclick = () => {
                debugLog("change selected-group text " + groups[i].id);
                document.getElementById("selected-group").innerHTML = groups[i].name;
                this.target_group_id = groups[i].id;
            }
        }
    }

    render(id, resp) {
        document.getElementById("new-quiz").click();
        debugLog("ID = " + id);
        this.editQuizById = id;
        // добавить id викторины в заголовок
        document.getElementById("quiz-editor-h3").innerHTML = `Викторина ${this.editQuizById}`;
        // кнопка запуска викторины
        this.startQuizBtn(resp);
        this.selectTargetGroupBtn(globalBus().saver.userTeacherOrg);
        document.getElementById("edit-quiz-form").querySelector("#edit-quiz-form__title").value =
            resp.title;
        document.getElementById("edit-quiz-form").querySelector("#edit-quiz-form__description").value =
            resp.description;
        document.getElementById("edit-quiz-form").querySelector("#edit-quiz-form__tags").value =
            resp.tags.join();
        // количество вопросов
        let questionsCount = resp.questions.length;
        debugLog("questionsCount" + questionsCount);
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
        debugLog("clear form");
        this.editQuizById = false;
        debugLog(this.editQuizById);
        document.querySelector(".edit-page__form").innerHTML = "";
        document.querySelector(".edit-page__form").innerHTML = emptyQuizForm();
        this.index = 1;
    }

    deleteQuestion(i) {
        globalBus().modalWindow.setHeader("Удаление вопроса");
        globalBus().modalWindow.setBody(`Вы уверены, что хотите удалить ${i+1} вопрос?`);
        globalBus().modalWindow.show();
        globalBus().modalWindow.addEventsOnButtons(() => {
            debugLog("func for OK");
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
                    debugLog(i);
                };
            }
            // edit-quiz-form__question-box_${index}
            // delete-question-box_${index}
            // <span id=q_num_${index} class="input-group-text">Вопрос ${index + 1} </span>
        });
    }
}