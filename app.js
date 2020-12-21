class Question{
    constructor(difficulty, operation){
        this.difficulty = difficulty;
        this.createQuestion(difficulty, operation)
    }
    
    createQuestion(diff, op){
        if(diff==='easy'){
            return this.easy(op)
        }else if(diff==='average'){
            return this.normal(op)
        } else if(diff==='hard'){
            return this.hard(op)
        }else{
            return;
        }
    }    
    
    easy(operation){
        this.compute(1,10,operation)
    }

    normal(operation){
        this.compute(10,20,operation)
    }
    hard(operation){
        this.compute(20,30,operation)
    }

    compute(min, max, operation){
        let num1 = this.random(min+5, max),
        num2 = this.random(min, max);

        if(this.difficulty=='easy'){
            num1 = this.random(min, 5) + 5;
            num2 = num1 - this.random(min, 5);
        }
        
       switch(operation){
           case '+':
            this.question = `${num1} + ${num2}`;
            this.answer = (num1+num2).toString()
           break;
           case '-':
            this.question = `${num1} - ${num2}`;
            this.answer = (num1-num2).toString()
           break;
           case '×':
            this.question = `${num1} × ${num2}`;
            this.answer = (num1*num2).toString()
           break;
           case '÷':
               if(num2===1) ++num2
            this.question = `${num1} ÷ ${num2}`;
            this.answer = +parseFloat((num1/num2).toFixed(2)).toString();
           break;
           default:
               return;
       }
    }
    
    random(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min
    } 
}


let optionsParent = document.querySelector('.options'),
startDiv = document.querySelector('.start-options'),
questionDiv = document.querySelector('.question'),
noti = document.querySelector('.notify'),
startButton = document.querySelector('#start'),
nextQuestionBtn = document.querySelector('.footer button'),
difficulty = document.getElementById('difficulty'),
totalQuestionsInput = document.getElementById('totalQuestions'),
totalMarks=0,
totalQuestions,
totalQuestions2,
operation,
previousQuestion;

optionsParent.addEventListener('click', firstQue)
startDiv.addEventListener('click', firstQue)
startButton.addEventListener('click', startQuiz)
nextQuestionBtn.addEventListener('click', nextQuestion)

// function to initiate the quiz
function startQuiz(){
    confirmation()
    difficulty = difficulty.value;
    operation = document.querySelector('[selected="true"]').getAttribute('operand');
    let div = document.querySelector('.start');
    div.className='start animated fadeOut';
        div.onanimationend = function() {
            div.classList.add('hide');
            questionDiv.className = 'question show animated fadeIn';
            div.remove()
        }
        totalQuestions = document.querySelector('#totalQuestions').value;
        totalQuestions2 = totalQuestions;
        initiateClass()
}

// function that take cares of the next question
function nextQuestion(){
    confirmation()
    calculateResult(previousQuestion);
    if(totalQuestions <= 0){
        nextQuestionBtn.innerText = 'Show Results'
    } 
    initiateClass()
}

// function that displays the every question on screen
function displayQuestion(question){
    let ans = question.answer,
    questionText = document.querySelector('.question .header h2'),
    num = parseFloat(ans),
    list = [num+question.random(9,30), ans, ans*question.random(2,8)+question.random(9,30), ans-question.random(1,6)+question.random(9,30)]
    list = list.sort(() => Math.random() - 0.5)
    questionText.innerText = `What's ${question.question}=???`;
    optionsParent.innerHTML = ''
    list.forEach(item =>{
        const span = document.createElement('span')
        span.className='option-container'
        span.innerText = item;
        optionsParent.appendChild(span)
    })
}

// function that will reset the selected attribute on each new question
function firstQue(e){
    let options = document.querySelectorAll('.option-container')
    if(e.target.className=='option-container'){
        options.forEach(o => {
            o.className = 'option-container'
            o.removeAttribute('selected')
            nextQuestionBtn.classList.add('btn-active')
        })
        e.target.setAttribute('selected', true)
        e.target.className='option-container option-focus animated jello';
    }else {
        return
    }
}

// function that initiates the class just to prevent dry code
function initiateClass(){
    if(totalQuestions <= 0){
        displayResult()
    } else{
        const question = new Question(difficulty, operation)
        previousQuestion = question;
        displayQuestion(question);
    }
}

// function to keep track of the score
function calculateResult(question){
    const userAnswer = document.querySelector('[selected="true"]').innerText;
    --totalQuestions;
    if(userAnswer === question.answer){
        ++totalMarks;
    }else{
        return;
    }
}

// function to display scores on the page
function displayResult(){
    let resultDiv = document.querySelector('.result');
    gradeDiv = document.querySelector('.grade'),
    score = grade(totalMarks, totalQuestions2);
    questionDiv.className = 'question animated fadeOut hide'
    resultDiv.children[1].parentElement.className = 'result show animated fadeIn'
    resultDiv.children[1].innerHTML = 
    `<span class="option-container total">Total Questions: ${totalQuestions2}</span><span class="option-container correct">Correct: ${totalMarks}</span><span class="option-container wrong">Wrong: ${totalQuestions2-totalMarks}</span>`
    gradeDiv.innerHTML = `<p>${score}</p>`

}

// util functions
function confirmation(){
    if(!document.querySelector('[selected="true"]')){
        notify('Please Select all the required inputs.');
        throw new Error('Please select all the required inputs')
    }
}

// alert function
function notify(msg){
    noti.innerText = msg;
    noti.style.color = 'var(--text-color)'
    noti.style.background = 'var(--div-bg)';
    noti.className = 'notify show animated slideInRight'
    setTimeout(()=>{
        noti.className='notify show animated slideOutRight'
    }, 1000)
}

// calculate grade
function grade(correct, total){
    let percent = (100 * correct) / total;
    if(percent >= 97) {
        return "A+"
    }else if(percent >= 90) {
        return "A"
    }else if(percent<=89&&percent>=80) {
        return "B"
    }else if(percent<=79&&percent>=70) {
        return "C"
    } else if(percent<=69&&percent>=60) {
        return "D"
    }else if(percent<60) {
        return "F"
    }else {
        return;
    }
}