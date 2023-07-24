"use strict";

//Elements
const mainContainer = document.querySelector(".main-container");
const form = document.getElementById("surveyForm");
const surveyContainer = document.querySelector(".survey-container");
const quesBlock = document.querySelector(".ques-block");
const welcomeBlock = document.querySelector(".welcome-block");
const btnStart = document.querySelector(".btn-start");
const prevBtn = document.querySelector(".prev-btn");
const skipBtn = document.querySelector(".skip-btn");
const submitBtn = document.querySelector(".submit-btn");
const nextBtn = document.querySelector(".next-btn");
// const ratingContainer = document.querySelector(".rating-container");
const btnBlock = document.querySelector(".btn-block");
const whichQues = document.querySelector(".which-ques");
const textAnswer = document.getElementById("textanswer");
const for4th = document.querySelector(".for4");
const questions = document.querySelectorAll(".question");
const thankyou = document.querySelector(".thank-you-screen");
let currentQuestionIndex = 1;
let totalNumberOFQues = 5;
let customerSessionId;
const surveyData = JSON.parse(localStorage.getItem("surveyData")) || {};
/*const questionsList = [
  {
    qno: 1,
    question: "How satisfied are you with our products?",
    inputType: "radio",
    numberOfradio: 5,
  },
  {
    qno: 2,
    question: "How fair are the prices compared to similar retailers?",
    inputType: "radio",
    numberOfradio: 5,
  },
  {
    qno: 3,
    question:
      "How satisfied are you with the value for money of your purchase?",
    inputType: "radio",
    numberOfradio: 5,
  },
  {
    qno: 4,
    question:
      "On a scale of 1-10 how would you recommend us to your friends and family?",
    inputType: "radio",
    numberOfradio: 10,
  },
  {
    qno: 5,
    question: "What could we do to improve our service?",
    inputType: "text",
    numberOfradio: null,
  },
];*/

btnStart.addEventListener("click", function (e) {
  e.preventDefault();
  surveyContainer.style.display = "block";
  welcomeBlock.style.display = "none";
  mainContainer.style.display = "block";
  customerSessionId = `session_${Date.now()}`;
  displayQuestion(currentQuestionIndex);
});

const displayQuestion = function (index) {
  if (index > totalNumberOFQues) {
    // If the survey is completed, show a thank you message or redirect to another page
    surveyContainer.style.display = "none";
    // document.getElementById("thankYouMessage").style.display = "block";
    return;
  }
  console.log("welcome", currentQuestionIndex, questions[1]);
  for (let i = 0; i < questions.length; i++) {
    questions[i].style.display = "none";
  }
  const questionDiv = document.getElementById(`${currentQuestionIndex}`);
  console.log("questionDiv", questionDiv);

  if (currentQuestionIndex >= 1 && currentQuestionIndex <= totalNumberOFQues) {
    questionDiv.style.display = "block";
    nextBtn.style.display = "block";
    skipBtn.style.display = "block";
    prevBtn.style.marginTop = "15rem";
    skipBtn.style.marginTop = "15rem";
    whichQues.innerText = `${currentQuestionIndex}/${totalNumberOFQues}`;

    // for previous button
    if (currentQuestionIndex > 1) {
      prevBtn.style.display = "block";
    } else {
      prevBtn.style.display = "none";
    }

    // For submit button
    if (currentQuestionIndex == totalNumberOFQues) {
      nextBtn.style.display = "none";
      submitBtn.style.display = "block";
      console.log("qno.", currentQuestionIndex);
      prevBtn.style.marginTop = "5rem";
      skipBtn.style.marginTop = "5rem";
    } else {
      submitBtn.style.display = "none";
    }
  }
};

const getValueFromInput = function () {
  let selectedAnswer;
  const answeredQuestionDiv = questions[currentQuestionIndex - 1];
  const inputList = answeredQuestionDiv.querySelectorAll("input");
  const textArea = answeredQuestionDiv.querySelectorAll("textarea");

  if (inputList.length > 0) {
    for (let i = 0; i < inputList.length; i++) {
      console.log("inputList[i]", inputList[i]);
      if (inputList[i].type === "radio" && inputList[i].checked === true) {
        selectedAnswer = inputList[i].value;
      }
    }
  } else {
    console.log("textArea", textArea);
    selectedAnswer = textArea[0].value;
  }
  return selectedAnswer;
};
/*
const getValueFromLabel = function () {
  let selectedAnswer;
  const answeredQuestionDiv = questions[currentQuestionIndex - 1];
  const inputList = answeredQuestionDiv.querySelectorAll("input");
  const labelList = answeredQuestionDiv.querySelectorAll("label");
  const textArea = answeredQuestionDiv.querySelectorAll("textarea");

  if (labelList.length > 0) {
    for (let i = 0; i < labelList.length; i++) {
      console.log("labelList[i]", labelList[i]);
      if (inputList[i].type === "radio" && inputList[i].checked === true) {
        console.log("label");
        selectedAnswer = labelList[i].innerText;
      }
    }
  } else {
    console.log("textArea", textArea);
    selectedAnswer = textArea[0].value;
  }
  return selectedAnswer;
};
*/
nextBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const selectedAnswer = getValueFromInput();
  console.log("selectedAnswer", selectedAnswer);
  saveAnswerToLocalStorage(currentQuestionIndex, selectedAnswer);
  currentQuestionIndex++;
  displayQuestion(currentQuestionIndex);
  // quesNoFromTotal(ques);
});

prevBtn.addEventListener("click", function () {
  surveyContainer.style.display = "block";
  const selectedAnswer = getValueFromInput();
  console.log(selectedAnswer);
  removeAnswerFromoLocalStorage(currentQuestionIndex, selectedAnswer);
  --currentQuestionIndex;

  displayQuestion(currentQuestionIndex);
  // quesNoFromTotal(ques);
});

skipBtn.addEventListener("click", function () {
  surveyContainer.style.display = "block";
  currentQuestionIndex++;
  displayQuestion(currentQuestionIndex);
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const selectedAnswer = getValueFromInput();
  saveAnswerToLocalStorage(currentQuestionIndex, selectedAnswer);
  // Ask for confirmation before submitting the survey
  const isConfirmed = window.confirm(
    "Are you sure you want to submit the survey?"
  );

  if (isConfirmed) {
    localStorage.setItem(`${customerSessionId}_status`, "COMPLETED");
    // Save the survey data in local storage
    // displayQuestion(++currentQuestionIndex);
    surveyContainer.style.display = "none";
    thankyou.style.display = "block";
    // document.querySelector(".survey-container").classList.add("hidden");
    document.querySelector(".welcome-block").classList.add("hidden");

    setTimeout(function () {
      //document.querySelector(".thank-you-screen").classList.add("hidden");
      //document.querySelector(".welcome-block").classList.remove("hidden");
      thankyou.style.display = "none";
      welcomeBlock.style.display = "block";
      currentQuestionIndex = 1;
    }, 5000);
  }
});

function saveAnswerToLocalStorage(questionIndex, answer) {
  // Assuming customerSessionId is unique for each session
  const surveyData = JSON.parse(localStorage.getItem(customerSessionId)) || [];
  console.log(surveyData);
  surveyData.push({ questionIndex, answer });
  localStorage.setItem(customerSessionId, JSON.stringify(surveyData));
}

function removeAnswerFromoLocalStorage(questionIndex, answer) {
  // Assuming customerSessionId is unique for each session
  const surveyData = JSON.parse(localStorage.getItem(customerSessionId)) || [];
  console.log(surveyData);
  surveyData.pop({ questionIndex, answer });
  localStorage.setItem(customerSessionId, JSON.stringify(surveyData));
}
