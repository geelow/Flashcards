//require inquirer and fs + reference create Cloze and simple prototypes
const SimpleCard = require("./Simple");
const Cloze = require("./Cloze");
const inquirer = require("inquirer");
const fs = require("fs");

var correct = 0;
var wrong = 0;
var cardArray = [];
//var userAnswer = [];

const flashcards = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'userType',
        message: 'Options:',
        choices: ['Basic_quiz', 'Cloze_quiz', 'Create_cards', 'Create_cloze_cards', 'Quit']
            }]).then(function(choice) {

            if (choice.userType === 'Create_cards') {
                readCards('log.txt');
                createCards(basicPrompt, 'log.txt');
            } else if (choice.userType === 'Create_cloze_cards') {
                readCards('cloze-log.txt');
                createCards(clozePrompt, 'cloze-log.txt');
            } else if (choice.userType === 'Basic_quiz') {
                quiz('log.txt', 0);
            } else if (choice.userType === 'Cloze_quiz') {
                quiz('cloze-log.txt', 0);
            } else if (choice.userType === 'Quit') {
                console.log('See you later!');
            }
        });
    }
   
const readCards = (logFile) => {
    cardArray = [];
    fs.readFile(logFile, "utf8", function(error, data) {
        var jsonContent = JSON.parse(data);
        for (let i = 0; i < jsonContent.length; i++) {
            cardArray.push(jsonContent[i]);
        }
    });
};

const createCards = (promptType, logFile) => {
    inquirer.prompt(promptType).then(function(answers) {
        cardArray.push(answers);
        if (answers.makeMore) {
            createCards(promptType, logFile);
        } else {
            writeToLog(logFile, JSON.stringify(cardArray));
            flashcards();
        }
    });
};

const quiz = (logFile, x) => {
    fs.readFile(logFile, "utf8", function(error, data) {
        var jsonContent = JSON.parse(data);
        if (x < jsonContent.length) {
            if (jsonContent[x].hasOwnProperty("front")) {
                var gameCard = new SimpleCard(jsonContent[x].front, jsonContent[x].back);
                var gameQuestion = gameCard.front;
                var gameAnswer = gameCard.back.toLowerCase();
            } else {
                var gameCard = new Cloze(jsonContent[x].text, jsonContent[x].cloze);
                var gameQuestion = gameCard.message;
                var gameAnswer = gameCard.cloze.toLowerCase();
            }
            inquirer.prompt([{
                name: "question",
                message: gameQuestion,
                validate: function(value) {

                    if (value.length > 0) {
                        return true;
                    }
                    return 'Are you sure?';
                }

            }]).then(function(answers) {

                if (answers.question.toLowerCase().indexOf(gameAnswer) > -1) {
                    console.log('Correct');
                    correct++;
                    x++;
                    quiz(logFile, x);
                } else {
                    gameCard.printAnswer();
                    wrong++;
                    x++;
                    quiz(logFile, x);
                }
            })
        } else {
            console.log('Score: ');
            console.log('correct: ' + correct);
            console.log('wrong: ' + wrong);
            correct = 0;
            wrong = 0;
            flashcards();
        }
    });
};

const writeToLog = (logFile, info) => {
    fs.writeFile(logFile, info, function(err) {
        if (err)
            console.error(err);
    });
}
const basicPrompt = [{
    name: "front",
    message: "Create Front of Card: "
}, {
    name: "back",
    message: "Create Back of Card: "

}, {
    type: 'confirm',
    name: 'makeMore',
    message: 'Make more cards (hit enter)?',
    default: true
}]

const clozePrompt = [{
    name: "text",
    message: "Write a guessable sentence and hide a word in parentheses, like (this).",
    validate: function(value) {
        var parentheses = /\(\w.+\)/;
        if (value.search(parentheses) > -1) {
            return true;
        }
        return 'Please put a word of your sentence in parentheses'
    }
}, {
    type: 'confirm',
    name: 'makeMore',
    message: 'Create another card? Hit enter for YES.',
    default: true
}]

const makeMore = {
    type: 'confirm',
    name: 'makeMore',
    message: 'Create another card? Hit enter for YES.',
    default: true
}

flashcards();
