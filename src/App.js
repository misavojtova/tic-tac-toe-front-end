import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiCircle } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import "./App.css";

function App() {
  const [playerOne, setPlayerOne] = useState(true);
  const [playertwo, setPlayerTwo] = useState(false);
  const [input, setInput] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState("Player 1 ( X ) . . START THE GAME!");

  const [clicked, setClicked] = useState({
    true: false,
    id: "",
  });

  const getArr = async () => {
    const { data } = await axios.get(
      "https://tic-tac-toe-apply.herokuapp.com/api/tic"
    );
    setInput(data);
  };
  useEffect(() => {
    getArr();
  }, []);

  const resetGame = async () => {
    try {
      setPlayerOne(true);
      setPlayerTwo(false);
      setDisabled(false);
      setClicked(false);
      setMessage("Player 1 ( X ) . .  START THE GAME!");
      await axios.post("https://tic-tac-toe-apply.herokuapp.com/api/tic");
      getArr();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (id) => {
    try {
      setPlayerOne(!playerOne);
      setPlayerTwo(!playertwo);
      setClicked({ true: true, id: id });
      const inputData = playerOne
        ? { player: "Player 1", input: "X" }
        : { player: "Player 2", input: "O" };

      const upd = await axios.patch(
        `https://tic-tac-toe-apply.herokuapp.com/api/tic/${id}`,
        {
          inputData,
        }
      );
      if (upd.data.code === "852963") return;
      getArr();

      const res = await axios.get(
        `https://tic-tac-toe-apply.herokuapp.com/api/tic/winner`
      );
      res.data.code === "123456" && setDisabled(true);
      setMessage(res.data.msg);
      res.data.code === "654321" && setDisabled(true);
      setMessage(res.data.msg);
      res.data.code === "789456" && setMessage(res.data.msg);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='tic-tac-con'>
      <h1 className='tic-tac-title'>Tic Tac Toe</h1>
      <div className='message-wrap'>
        <h2 className='message'>{message}</h2>
      </div>

      <div disabled={disabled} className='main-grid'>
        {input &&
          input.map((cell) => {
            return (
              <div
                key={cell.id}
                onClick={() => handleClick(cell.id)}
                className={`box ${cell.box_id}`}
              >
                {cell.input === "X" && <GrClose className='cross' />}
                {cell.input === "O" && <FiCircle className='circle' />}
              </div>
            );
          })}
      </div>
      <button className='reset-btn' onClick={resetGame}>
        <h5 className='reset-btn-title'>Reset Game</h5>
      </button>
    </div>
  );
}

export default App;
