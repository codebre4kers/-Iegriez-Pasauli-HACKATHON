import React from "react";
import styled from "styled-components";
import Spinner from "../spinner/Spinner";
import FirstStageQuestions from "../firstStage/FirstStageQuestions";
import { useSelector } from "react-redux";
import { selectTheme } from "../features/gameSlice";

function Home({
  SpinTheWheel,
  wheelRef,
  spinAgain,
  firstPartAnswer,
  answerCounter,
  showTreasureChest,
  openTreasureChest
}) {
  const ThemeName = useSelector(selectTheme);

  return (
    <HomePage>
      {showTreasureChest ? (
        <div className={!openTreasureChest ? "shaking_chest" : "open_chest"}>
          <img src={openTreasureChest ? "firstStageResources/treasureopen.svg" : "firstStageResources/treasure.svg"} alt="chest"/>
        </div>
      ) : (
        <SpinnerContainer>
          <SpinnerArrow/>
          <Spinner wheelRef={wheelRef} />
          <button disabled={!spinAgain} onClick={SpinTheWheel}>Iegriezt</button>
        </SpinnerContainer>
      )}

      <div
        className={`question__popup ${
          ThemeName !== "" && spinAgain ? "open__question--popup" : ""
        }`}
      >
        <FirstStageQuestions
          answerCounter={answerCounter}
          firstPartAnswer={firstPartAnswer}
        />
      </div>
    </HomePage>
  );
}
const HomePage = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  background: #ebe1d1;
  width: 100%;
  justify-content: center;
  > .question__popup {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: -1;
    display: flex;
    flex-direction: column;
    background: #ebe1d1;
    transform: translateY(50%);
    opacity: 0;
    overflow: hidden;
    transition: all 1s ease;
  }
  > .open__question--popup {
    transform: translateY(0%);
    opacity: 1;
    z-index: 10;
  }
  >.shaking_chest{
    animation: shakeChest 0.3s ease infinite;
  }
  @keyframes shakeChest{
    0%{
      transform: rotate(-2deg);
    }
    50%{
      transform: rotate(0deg);
    }
    100%{
      transform: rotate(2deg);
    }
  }
`;
const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  > button {
    font-family: "Josefin Sans", sans-serif;
    height: 80px;
    width:80px;
    margin-top: 210px;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius:50%;
    z-index: 5;
    border: 5px solid lightgray;
    box-shadow:rgba(0,0,0,0.1) 0px 3px 0px;
    -webkit-user-select: none;
    -webkit-transform: perspective(1px) translateZ(0);
    transform: perspective(1px) translateZ(0);
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-property: transform;
    transition-property: transform;
    :hover{
      -webkit-transform: scale(1.1);
      transform: scale(1.1);
    }
    :active{
      border: 5px solid whitesmoke;
      background-color: lightgray;
    }
    :disabled{
      border: 5px solid whitesmoke;
      background-color: #dbd4d4;
      :hover{
        -webkit-transform: scale(1);
        transform: scale(1);
      }
    }
    > p {
      font-size: 18px;
      color: #2f2f2f;
      padding-left: 2px;
      padding-top: 5px;
    }
  }
  @media(max-width: 456px){
    >button{
      height: 65px;
      width:65px;
      border: 3px solid lightgray;
    }
  }
  @media(max-height: 568px){
    >button{
      margin-top: 155px;
    }
  }
`;
const SpinnerArrow = styled.div`
  width: 0;
  height: 0;
  position: absolute;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-top: 25px solid  #3c3c58;
  top: 26%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 10;
  color:  #3c3c58;
  @media(max-width: 594px){
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid #3c3c58;
  }
  @media(max-width:360px){
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-top: 15px solid #3c3c58;
  }
  @media(max-width: 800px){
    top: 35%;
  }
  @media(max-width: 768px){
    top: 33%;
  }
  @media(max-width: 750px){
    top: 30%;
  }
  @media(max-width: 664px){
    top: 35%;
  }
  @media(max-width: 620px){
    top: 37%;
  }
  @media(max-width: 600px){
    top: 37%;
  }
  @media(max-width: 552px){
    top: 27%;
  }
  @media(max-width: 544px){
    top: 32%;
  }
  @media(max-width: 444px){
    top: 38%;
  }
  @media(max-width: 438px){
    top: 37%;
  }
  @media(max-width: 414px){
    top: 40%;
  }
  @media(max-width: 375px){
    top: 40%;
  }
  @media(max-width: 372px){
    top: 37%;
  }
  @media(max-width: 360px){
    top: 41%;
  }
  @media(max-width: 320px){
    top: 38%;
  }
`;

export default Home;