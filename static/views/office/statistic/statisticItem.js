"use strict";

export default function statisticItem(pin, quiz_name, game_date, org_name, group_name) {
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
                            <small class="mb-1 text-left"><u>Организация:</u> ${org_name}</small><br>
                            <small class="text-left"><u>Группа:</u> ${group_name}</small>
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
