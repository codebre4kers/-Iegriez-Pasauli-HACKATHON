import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startGame,
  findImage,
  addThemeQuestions,
  selectQuestions,
} from "./features/gameSlice";
import { checkSecondStage, setActiveCorrectAnswer, setActiveAnswers, startSecondStage, setAllQs, setActiveQuestion } from "./features/secondStageSlice";
import { addPoints } from "./features/userSlice";
import Home from "./pages/Home";
import SecondStage from "./pages/SecondStage";
import GlobalStyles from "./styles/GlobalStyles";
import {wheelStops} from "./data/wheelOptions";
import ThirdStage from "./pages/ThirdStage";
import { finish, selecthasfinished } from "./features/finishSlice";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

function App() {
  const [spinAgain, setSpinAgain] = useState(true);
  const [answerCounter, setAnswerCounter] = useState(0);
  const [ssQuestionState, setSsQuestionState] = useState(false);
  const [ssAnswer, setSsAnswer] = useState("");
  const [ssCheckingId, setSsCheckingId] = useState(undefined);
  const [ssAnswerCounter, setSsAnswerCounter] = useState(0);
  const [thirdStageStarted, setThirdStageStarted] = useState(false);
  const [thirdStageFoundWords, setThirdStageFoundWords] = useState([]);
  const [instructionState, setInstructionState] = useState(false);
  //nepareizie trešās daļas jēdzieni
  const [tsIncorrectWords, setTsIncorrectWords] = useState([
    "nešķiro atkritumus",
    "tērē ūdeni",
    "pērc jaunu",
    "izmanto ķīmiju",
    "neremontē",
    "nepērc vietējo",
    "nepārstrādā",
    "nelabo",
    "nešķiro atkritumus",
    "pērc jaunu",
    "nešķiro",
    "piesārņo",
    "pērc vairāk"
  ]);
  //pareizie trešās daļas jēdzieni
  const [tsCorrectWords, setTsCorrectWords] = useState([
    "remontē", 
    "salabo", 
    "sašuj", 
    "salāpi", 
    "šķiro", 
    "atdod", 
    "aizņemies", 
    "iestādi", 
    "audzē", 
    "pārstrādā", 
    "ēd vietējo",
    "samal"
  ])
  const [tsCountdownTimer, setTsCountdownTimer] = useState(4);
  const [startWordFlow, setStartWordFlow] = useState(false);
  const [finishCountDown, setFinishCountDown] = useState(15);

  const activeQuestions = useSelector(selectQuestions);
  const secondStageStarted = useSelector(checkSecondStage);
  const hasFinished = useSelector(selecthasfinished);

  const dispatch = useDispatch();
  const wheelRef = useRef();

  useEffect(() => {
    if(!hasFinished){
      //izpildīt, ja spēle nav beigusies
      if(tsCountdownTimer > 0 && thirdStageStarted){
        setTimeout(() => {
          //atskaita sākuma laiku (3, 2, 1)
          setTsCountdownTimer(tsCountdownTimer - 1);
        }, 1000);
      }else if(tsCountdownTimer === 0){
        //kad (3, 2, 1) atskaites taimeris ir 0, tad izpildīt šo:  
        setStartWordFlow(true); //sāk vārdu krišanas spēli
        setTimeout(() => {
          //atskaitīt dotās sekundes līdz finišam
          setFinishCountDown(finishCountDown - 1);
        }, 1000);
        if(finishCountDown === 0){
          //kad finiša laiks sasniedz 0 tad pasaka ka ir finišējis
          dispatch(finish());
          return;
        }
      }
    }else{
      return;
    }    
  }, [thirdStageStarted, tsCountdownTimer, finishCountDown]);

  //Izvēlas nejaušu opciju, uz kuras rats uzgriezīsies
  let randomStop = wheelStops[Math.floor(Math.random() * 5) + 0];

  //Iegriež ratu
  const SpinTheWheel = () => {
    setSpinAgain(false); //Ja rats griežas, neļaut iegriezt vēlreiz
    wheelRef.current.style.transform = `rotate(${randomStop.deg}deg)`;
    dispatch(startGame(randomStop.value)); //Aizsūta jautājumu tēmu uz Redux
    dispatch(findImage(randomStop.image));
    dispatch(addThemeQuestions(randomStop.questions));
    setTimeout(() => {
      setSpinAgain(true); //Kad rats beidz griezties, atļaut iegriezt velreiz
    }, 6000);
  };

  //atbild uz pirmās daļas jautājumu
  const firstPartAnswer = (answer) => {
    if (answerCounter > 3) {
      //kad atbild uz visiem jautājumiem, sāk otro spēles daļu
      dispatch(startSecondStage());
      //Aizsūta otrās daļas jautājumus uz Redux
      dispatch(setAllQs(randomStop.secondStageQuestions));
      return;
    }
    setAnswerCounter(answerCounter + 1);
    if(activeQuestions[answerCounter].a === answer) {
      //ja atbild pareizi, palielina punktu skaitu
      dispatch(addPoints());
    }
  };

  //atver jautājuma popupu
  const openSecondStageQuestion = (question, answerOptions, correctAnswer, id) => {
    //atrod jautājuma id
    setSsCheckingId(id);
    //nosūta jautājuma info uz Redux
    dispatch(setActiveQuestion(question));
    dispatch(setActiveAnswers(answerOptions));
    dispatch(setActiveCorrectAnswer(correctAnswer));
    //atver jautājuma popupu
    setSsQuestionState(true);
  }

  //pārbauda otrās daļas atbildi
  const closeSecondStageQuestion = (e, correct) => {
    e.preventDefault();
    if(ssAnswer === ""){
      return;
    }else if(ssAnswer === correct){
      //Ja atbild pareizi, palielina punktu skaitu
      dispatch(addPoints());
    }
    setSsAnswerCounter(ssAnswerCounter + 1);
    if(ssAnswerCounter === 14){
      startThirdStage();
    }
    document.getElementById(`visible${ssCheckingId}`).style.display = "none";
    setSsAnswer("");
    //aizver jautājuma popupu
    setSsQuestionState(false);
  }

  //sāk trešo spēles daļu
  const startThirdStage = () => {
    setThirdStageStarted(true);    
  }

  //kad noklikšķina uz pareizo vārdu izpildās:
  const clickWord = (foundWord) => {
    setThirdStageFoundWords([...thirdStageFoundWords, foundWord]); //pieliek noklikšķināto vārdu atrasto vārdu masīvam
    setTsCorrectWords(tsCorrectWords.filter(name => name !== foundWord)); //noņem noklikšķināto vārdu no pareizo vārdu masīva
    dispatch(addPoints()); //palielina punktu skaitu
  }

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Switch>
        <Route path="/game">
          {thirdStageStarted ? (
            <ThirdStage
              thirdStageFoundWords={thirdStageFoundWords}
              clickWord={clickWord}
              startWordFlow={startWordFlow}
              tsCountdownTimer={tsCountdownTimer}
              tsCorrectWords={tsCorrectWords}
              tsIncorrectWords={tsIncorrectWords}
            />
          ) : (
            <>
              {secondStageStarted ? (
                <SecondStage
                  ssAnswer={ssAnswer}
                  setSsAnswer={setSsAnswer}
                  ssQuestionState={ssQuestionState}
                  openSecondStageQuestion={openSecondStageQuestion}
                  closeSecondStageQuestion={closeSecondStageQuestion}
                />
              ) : (
                <Home
                  answerCounter={answerCounter}
                  firstPartAnswer={firstPartAnswer}
                  spinAgain={spinAgain}
                  wheelRef={wheelRef}
                  SpinTheWheel={SpinTheWheel}
                />
              )}
            </>
          )}
        </Route>
        <Route path="/">
          <LandingPage
            instructionState={instructionState}
            setInstructionState={setInstructionState}
          />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
