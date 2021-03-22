fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        let preQuestions = resp.sort(() => Math.random() - 0.5);


        let next = document.querySelector('.next');
        let previous = document.querySelector('.previous');
        let progressBar = document.querySelector('.progress-bar');

        let question = document.querySelector('.question');
        let questionIndex = document.querySelector('.question-index');
        let answers = document.querySelectorAll('.list-group-item');

        let list = document.querySelector('.list');
        let results = document.querySelector('.results');
        let resultsHistory = document.querySelector('.results-history');

        let userScorePoint = document.querySelector('.userScorePoint');
        let average = document.querySelector('.average');

        let button = document.querySelector('.scroll');
        button.addEventListener('click', goToTop);


        let pointsElem = document.querySelector('.score');
        let restart = document.querySelector('.restart');
        let index = 0;
        let points = 0;
        let activeAnswers = true;
        let obj = {answers: []};

        progressBar.style.width = "100%"
        let counter = 14
        setInterval(function () {
            if (counter >= 0 && activeAnswers) {
                progressBar.style.width = (counter / 15 * 100) + "%"
                progressBar.innerHTML = (counter) + "s"
                counter--;
            }
            if (counter < 0) {
                obj.answers[index] = null
                progressBar.innerHTML = ""
                disableAnswers();
            }
            console.log(counter)
        }, 1000);


        setQuestion(index)
        for (let i = 0; i < answers.length; i++) {
            answers[i].addEventListener('click', doAction);
        }

        function doAction(event) {
            //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
            if (activeAnswers) {
                if (event.target.innerHTML === preQuestions[index].correct_answer) {
                    points++;
                    pointsElem.innerText = points;
                    obj.answers[index] = event.target.innerHTML
                    markCorrect(event.target);
                } else {
                    obj.answers[index] = event.target.innerHTML
                    markInCorrect(event.target);

                }
                disableAnswers();
            }
        }

        function markCorrect(e) {
            e.classList.add('correct')
        }

        function markInCorrect(e) {
            e.classList.add('incorrect')
        }

        function activateAnswers() {
            activeAnswers = true;
        }

        function disableAnswers() {
            activeAnswers = false;
        }

        function setQuestion(index) {
            question.innerHTML = preQuestions[index].question
            questionIndex.innerHTML = (index + 1) + ' z ' + preQuestions.length
            for (let i = 0; i < 4; i++) {
                if (i < preQuestions[index].answers.length) {
                    answers[i].innerHTML = preQuestions[index].answers[i];
                    answers[i].style.display = 'block';
                } else {
                    answers[i].style.display = 'none';
                }
            }
        }

        restart.addEventListener('click', function (event) {
            event.preventDefault();

            index = 0;
            points = 0;
            let userScorePoint = document.querySelector('.score');
            userScorePoint.innerHTML = points;
            setQuestion(index);
            activateAnswers();
            list.style.display = 'block';
            results.style.display = 'none';
        });

        next.addEventListener('click', function (event) {
            event.preventDefault();
            index++;
            if (index < preQuestions.length) {
                localStorage.setItem("test", JSON.stringify(obj));
                counter = 15
                activateAnswers();

                setQuestion(index)
                preQuestions[index].answers.map((answer, i) => {
                    answers[i].classList.remove('correct')
                    answers[i].classList.remove('incorrect')
                })
            }

            if (index === preQuestions.length) {
                list.style.display = 'none';
                results.style.display = 'block';
                disableAnswers();

                let returnCode = '';

                preQuestions.map((item, index) =>{
                    returnCode += "Question: <span class=\"question-index\">"+(index + 1) + " z " + preQuestions.length+"</span>" +
                            "<h4 class=\"question\">"+preQuestions[index].question+"</h4>" +
                            "Answers:"+
                            "<ul class=\"list-group\">"

                    for (let i = 0; i < 4; i++) {
                        if (i < preQuestions[index].answers.length) {
                            if(preQuestions[index].correct_answer === obj.answers[index]) {
                                if(obj.answers[index] === preQuestions[index].answers[i]){
                                    returnCode += "<li class=\"list-group-item correct\">" + preQuestions[index].answers[i] + "</li>"
                                }else{
                                    returnCode += "<li class=\"list-group-item\">" + preQuestions[index].answers[i] + "</li>"
                                }
                            }
                            else{
                                if(obj.answers[index] === preQuestions[index].answers[i]){
                                    returnCode += "<li class=\"list-group-item incorrect\">" + preQuestions[index].answers[i] + "</li>"
                                }else{
                                    returnCode += "<li class=\"list-group-item\">" + preQuestions[index].answers[i] + "</li>"
                                }
                            }
                        }
                    }

                    returnCode += "</ul><hr/>"
                })

                resultsHistory.innerHTML = returnCode

                userScorePoint.innerHTML = points;
                average.innerHTML = (points / preQuestions.length * 100).toFixed(2) + '%'

            }
        });

        previous.addEventListener('click', function (event) {
            event.preventDefault();
            if (index > 0) {
                let obj = JSON.parse(localStorage.getItem("test"));
                index--;
                counter = 0
                disableAnswers();
                setQuestion(index)

                preQuestions[index].answers.map((answer, i) => {
                    if (answer === obj.answers[index]) {
                        if (obj.answers[index] === preQuestions[index].correct_answer) {
                            answers[i].classList.add('correct')
                        } else {
                            answers[i].classList.add('incorrect')
                        }

                    } else {
                        answers[i].classList.remove('correct')
                        answers[i].classList.remove('incorrect')
                    }
                })
            }

        });

        function goToTop() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }

    });
