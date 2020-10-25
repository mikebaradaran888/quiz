var qNo = 0;  // first question is question index zero
var data;  // all questions
var showAnswers = false;
var examName;
var username;

function append(id, htmlString) {
    var element = document.querySelector('#' + id);
    element.insertAdjacentHTML('beforeend', htmlString);
}

function setCorrectCss(index) {
    getQuestionLabel(index).style.backgroundColor = 'lightgreen';
}

function getQuestions() {
    return document.getElementsByName('q');
}

function getQuestionLabel(index) {
    return document.getElementsByTagName('label')[index];
}
function clearLastQuestion() {
    document.getElementById('info').innerHTML = "";
    document.getElementById('question').innerHTML = "";
}

function calcScore() {
    let score = 0;
    for (i = 0; i < data.length; i++) {
        if ((data[i].correctAnswer).toString() == (data[i].studentAnswer).toString())
            score++;
    }
    return score;
}

function endTest() {
    alert("You've scored " + calcScore() + '/' + data.length);
    // save the result in database
    registarStudentMark();
    showAnswers = confirm("Would you like to review the correct answers?");
}

function readQuestion() {
    // check for end of test
    if (qNo >= data.length) {
        if (confirm("You've answered all the questions. \nWould you like to stop?")) {
            endTest();
        }
    }

    clearLastQuestion();

    if (qNo < 0) qNo = 0;
    if (qNo >= data.length) qNo = data.length - 1;

    append('question', `<h3>${data[qNo].question}</h3>`)
    for (var i = 0; i < data[qNo].options.length; i++) {
        append('question', `<input type='${data[qNo].type}' name='q' value=${i}>`)
        append('question', `<label>${data[qNo].options[i]}</label><br />`)
    }

    let answers = data[qNo].studentAnswer;
    let radio = getQuestions(); // $(`[name=${"q"}]`);

    if (answers.length > 0) {  // they have already answered
        answers.forEach(op => radio[op].checked = true)
    }

    if (showAnswers) {
        let cAnswer = data[qNo].correctAnswer;
        for (var i = 0; i < cAnswer.length; i++) {
            setCorrectCss(cAnswer[i]);
        }
        console.log(radio[3].style);
    }
}

function getSelectedAnswers() {
    let selectedValues = [];
    let rbs = getQuestions();
    for (var i = 0; i < rbs.length; i++) {
        if (rbs[i].checked) selectedValues.push(i);
    }
    return selectedValues;
}


function nextQuestion(back) {
    var ans = getSelectedAnswers();
    if (ans.length == 0) {  // radio/checkBox not selected
        document.getElementById('info').innerHTML = 'Please select an option';
        return;
    }
    data[qNo].studentAnswer = ans; // save answers

    // show next/previous question
    qNo += (back) ? -1 : +1;
    readQuestion();
}
function registarStudentMark() {
    // Table column names:     testName, userName, maxPoints, grade, results
    let res = { 'testName': examName, 'userName': username, 'maxPoints': data.length, 'grade': calcScore()};
    let Qs = [];

    for (i = 0; i < data.length; i++) {
        let ca = (data[i].correctAnswer).toString();
        let sa = (data[i].studentAnswer).toString();
        if (ca != sa)
            Qs.push({ 'no': i, 'ca': ca, 'sa': sa });
    }
    res.results = Qs;
    params = JSON.stringify(res);
    console.log(params);
    var url = "http://qaa123.somee.com/quiz/ws/WebService1.asmx/saveResults";
    callAnyService(url, params, (res) => alert('Bad login!'));
}


function startTest() {
    var url = "http://qaa123.somee.com/quiz/ws/WebService1.asmx/getExam";
    examName = prompt("Please enter the test's name:", "questions.txt");
    username = prompt("Please enter the username:", "mike");
    var password = prompt("Please enter the password:", "password123");
    var params = `{examName: '${examName}', userName: '${username}', password: '${password}' }`;

    callAnyService(url, params, (res) => {
        if (res != null) {
            res = res.replace(/\\/g, '<br />');
            res = res.replace(/(\r\n|\n|\r)/gm, "");
            data = JSON.parse(res);
            if (data.username == username && data.password == password) {
                data = data.questions;
                readQuestion();   // display the first question 
            }
            else
                alert('Bad login!');
        }
    });
}
// ----------- web services --------------------
function callAnyService(url, params, callBack) {
    var request = new XMLHttpRequest();
    if (request == null)
        return false;

    request.open("POST", url, false);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            callBack(JSON.parse(request.responseText).d);
        }
    };
    request.send(params);
}

function uploadTest(testName) {
    var request = new XMLHttpRequest();
    if (request == null)
        return false;

    request.open("POST");
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            alert('File uploaded');
        }
    };
    request.send(params);
}

// ------------- OLD stuff ------------------
//function registarStudentMark() {
//    // just register the errors
//    let result = [];
//    result.push(examName);
//    result.push(username);
//    result.push(calcScore() + "/" + data.length);
//    for (i = 0; i < data.length; i++) {
//        let ca = (data[i].correctAnswer).toString();
//        let sa = (data[i].studentAnswer).toString();
//        if (ca != sa)
//            result.push(i + "|" + ca + "|" + sa);
//    }
//    console.log(result);
//}


