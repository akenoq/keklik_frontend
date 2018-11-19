"use strict";

export default function emptyQuizForm() {
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
            <red class="text-info">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
                При составлении вопросов обратите внимание,
                что варианты ответов во время соревнования будут перетасованы
            </red>
            <hr>
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