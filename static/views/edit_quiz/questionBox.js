"use strict";

export default function questionBox(index) {
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