'use strict';                                                                     //厳格なエラーチェックを設定
console.clear();
{
    const today = new Date();                                                     //Dateオブジェクトのインスタンスを作成
    let year = today.getFullYear();                                               //yearを現在の年で初期化
    let month = today.getMonth();                                                 //monthを現在の月で初期化


    /***********カレンダーの空白を埋めるために前月の日付を取得する************/
    function getCalendarHead() {
        const dates = []                                                          //日付を格納する空の配列を作成
        const d = new Date(year, month, 0).getDate()                              //d=前月の末日の日付　今月の０日目を指定で前月の末日を取得
        const n = new Date(year, month, 1).getDay();                              //n=今月の一日が何曜日に当たるかを数値で取得

        /*以下のループで前月の末日を、今月一日の曜日の数値分１マイナスしながら格納*/

        for (let i = 0; i < n; i++) {                                             //iを１引きながらnに満たないまでのループ

            dates.unshift({                                                       //先月分は配列の先頭に数値を格納したいのでunshiftを使用
                date: d - i,                                                      //ループするごとに前月の末日からi日分を引く
                isToday: false,                                                   //実際のカレンダー表示時に今日の日付を太字にしたいので真理値で判定
                isDisabled: true,                                                 //前月、翌月の日付は薄く表示したいのでDisabledはtrue
            });
        }
        return dates;                                                             //呼び出し元で関数内の実行結果を利用するために処理を返す
    }
    /*=======================================================================*/


    /************************今月分の日付を取得する***************************/
    function getCalendarBody() {
        const dates = [];                                                         //日付を格納する空の配列を作成                   
        const lastDate = new Date(year, month + 1, 0).getDate();                  //翌月の０日目を指定することで今月の末日を求めてlastDateに格納

        /*********以下のループで今月の末尾まで１増やしながら日付を格納する********/

        for (let i = 1; i <= lastDate; i++) {                                     //lastDateに格納されている末日まで１を増やしながらループ                      
            dates.push({                                                          //配列に格納
                date: i,                                                          //Dateクラスをiに適用
                isToday: false,                                                   //真理値で判定
                isDisabled: false,                                                //今月なのでfalse
            });
        }

        /**********************現在の日付を太字で表示する処理*********************/
        if (year === today.getFullYear() && month === today.getMonth()) {         //年と月が現在であるならば今日の日付だけisTodayをtrueに上書き
            dates[today.getDate() - 1].isToday = true;
        }

        return dates;                                                             //処理を返す
    }
    /*=======================================================================*/


    /***********カレンダーの空白を埋めるために翌月の日付を取得する************/
    function getCalendartail() {
        const dates = [];                                                         //日付を格納する空の配列を作成
        const lastDay = new Date(year, month + 1, 0).getDay();                    //今月の末日の曜日を数値として取得してlastDayに格納

        /**以下のループで7からlastDayを引いて、その数値に満たないまでの数値を格納*/

        if (lastDay == 6) {                                                       //
            for (let i = 1; i < 14 - lastDay; i++) {                              //
                dates.push({                                                      //
                    date: i,                                                      //末日が土曜日だった場合、翌月の７日までを薄く表示したい
                    isToday: false,                                               //
                    isDisabled: true,                                             //
                }                                                                 //
                );
            }
        } else {
            for (let i = 1; i < 7 - lastDay; i++) {                               //曜日の数値の最大値である７から末尾の曜日の数値を引くことで空白を求める
                dates.push({                                                      //翌月分の日付を格納
                    date: i,
                    isToday: false,                                               //翌月なのでfalse
                    isDisabled: true,                                             //翌月なので薄く表示
                }
                );
            }
        }

        return dates;                                                             //　処理を返す
    }
    /*=======================================================================*/


    /******************カレンダーをHTMLに描画するための処理*******************/
    function clearCalendar() {
        const tbody = document.querySelector('tbody');                            //createCalendarを呼び出すたびに、tbodyの中身をクリア（prev,nextを実行したときのため）

        while (tbody.firstChild) {                                                //tbody内の最初の子要素がある限りその子要素を削除することで該当月分のみを表示
            tbody.removeChild(tbody.firstChild);
        }
    }

    function renderTitle() {
        const title = `${year}/${String(month + 1).padStart(2, '0')}`;            //prev,nextを実行したときにカレンダー上部の日付を変える　01,02,03...とするためにpadStartを使用
        document.getElementById('title').textContent = title;                     //HTMLのidであるtitleを取得してconst titleをセット
    }


    function renderWeeks() {
        const dates = [                                                           //日付の配列を統合
            ...getCalendarHead(),                                                 //
            ...getCalendarBody(),                                                 //一つの配列内で展開してほしいので
            ...getCalendartail(),                                                 //スプレッド構文を使用
        ];                                                                        //                                                 


        const weeks = [];                                                         //HTMLで描画するときは７日ごとなのでその配列を作成
        const weeksCount = dates.length / 7;                                      //配列の長さを７で割ることで何週分あるかを求めweeksCountに格納

        for (let i = 0; i < weeksCount; i++) {                                    //weeksCountに満たないまでのループ
            weeks.push(dates.splice(0, 7));                                       //７日分ごとの日付の配列を格納　処理を回すごとに先頭から７日分を削除するためにsoliceを使用
        }

        weeks.forEach(week => {
            const tr = document.createElement('tr');                              //初めの<tr>を作る
            week.forEach(date => {                                                //weekには7日分の日付が入っている,1日はdateで表現
                const td = document.createElement('td');                          //1日づつ<td>を作る

                td.textContent = date.date;                        　             //<td>の中にdateの日付をセットする
                if (date.isToday) {                                           　  //dateが今日だったらCSSのtodayをクラスにセット
                    td.classList.add('today');
                }
                if (date.isDisabled) {                                          　//dateが今月の日付じゃなければclassにdisabledをセット
                    td.classList.add('disabled');
                }
                
                tr.appendChild(td);                                             　//trにtdをセット
            });
            document.querySelector('tbody').appendChild(tr);                  　  //tbodyにtrをセットする。これで一週間分
        });
    }
    /*=======================================================================*/



    /*************カレンダーを描画する処理を機能ごとにまとめた関数**************/
    function createCalendar() {                                                   
        clearCalendar();
        renderTitle();
        renderWeeks();
    }
    /*=======================================================================*/


    /***********************ボタン操作で前月を表示する************************/
    document.getElementById('prev').addEventListener('click', () => {             //HTMLidのprevを取得してクリックしたときの処理
        month--;                                                                  //月を１引いてカレンダーを描画

        if (month < 0) {                                                          //１月より小さければ年を１引いて月を１２月にセット
            year--;
            month = 11;
        }

        createCalendar();                                                         //日時の値を一か月前にしてcreateCalendarに飛ぶ
    });
    /*=======================================================================*/


    /***********************ボタン操作で翌月を表示する************************/
    document.getElementById('next').addEventListener('click', () => {             //HTMLidのnextを取得してクリックしたときの処理
        month++;                                                                  //月を１増やしてカレンダーを描画

        if (month > 11) {                                                         //１２月よりも大きければ年をい増やして月を一月にセット
            year++;
            month = 0;
        }
        createCalendar();                                                         //日時の値を一か月後にしてcreateClendarに飛ぶ
    });
    /*=======================================================================*/


    /************************ボタン操作で今月に戻る***************************/
    document.getElementById('today').addEventListener('click', () => {            //HTMLidのtodayを取得してクリックしたときの処理
        year = today.getFullYear();                                               //yearを現在に初期化
        month = today.getMonth();                                                 //monthを現在で初期化

        createCalendar();                                                         //初期化された値を持ってcreateClendarに飛ぶ
    });
    /*=======================================================================*/
    createCalendar();                                                             //ページが読み込まれたときに呼び出されカレンダーを初期表示させる
}
