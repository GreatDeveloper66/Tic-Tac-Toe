$(document).ready(function() {
  //button for user choosing to play X
  $("#choseX").click(function() {
    userisX();
    $("#message").html("Playing as X");
    enableAll();
  });

  //button for user choosing to play O
  $("#choseO").click(function() {
    userisO();
    $("#message").html("Playing as O");
    enableAll();
  });

  //constants
  const empty = -2;
  const X = 1;
  const O = 4;
  //GAME BOARD OBJECT TRACKING ALL THE GAME BOARD DATA
  var gameBoard = {
    //Did the the user pick X or O?
    userChoseX: true,
    usersTurn: true,
    computersTurn: false,
    //the squares on the boards start off empty.
    squares: [empty, empty, empty, empty, empty, empty, empty, empty, empty],
    winningPatterns: [
      Array(0, 1, 2),
      Array(3, 4, 5),
      Array(6, 7, 8),
      Array(0, 3, 6),
      Array(1, 4, 7),
      Array(2, 5, 8),
      Array(0, 4, 8),
      Array(2, 4, 6)
    ]
  };

  function attachGameReset() {
    $("#restartGame").click(function() {
      location.reload(true);
    });
  }

  //sets turns at beginning of game
  function setTurns() {
    if (userChoseX()) {
      userisX();
      gameBoard.usersTurn = true;
      gameBoard.computersTurn = false;
    } else {
      userisO();
      gameBoard.usersTurn = true;
      gameBoard.computersTurn = false;
    }
  }

  //this function returns the index of all empty squares
  function emptySquares() {
    var newKeys = [];
    for (var i = 0; i < 9; i++) {
      if (gameBoard.squares[i] === empty) {
        newKeys.push(i);
      }
    }
    return newKeys;
  }
  //calculates number of square for computer's next move
  function computerNextMove() {
    var nextSquare = winningSquare();
    if (nextSquare == -1) {
      return emptySquares().chooseRandom();
    } else {
      return nextSquare;
    }
  }
  //function checks to see if there is a space that allows an opponent
  //to win on the next move
  function winningSquare() {
    for (var i = 0; i <= 8; i++) {
      if (userChoseX()) {
        if (gameBoard.squares[i] === empty) {
          gameBoard.squares[i] = X;
          if (userWon()) {
            return i;
          } else {
            gameBoard.squares[i] = empty;
          }
        }
      } else {
        if (gameBoard.squares[i] === empty) {
          gameBoard.squares[i] = O;
          if (userWon()) {
            return i;
          } else {
            gameBoard.squares[i] = empty;
          }
        }
      }
    }
    return -1;
  }

  //array and board is updated based on computer's random next move
  function computerTurn() {
    var nextMove = computerNextMove();
    if (userChoseX()) {
      gameBoard.squares[nextMove] = O;
    } else {
      gameBoard.squares[nextMove] = X;
    }
    updateDisplay();
    scanBoard();
  }

  //disables all buttons on the board
  function disableAll() {
    for (var i = 1; i <= 9; i++) {
      $("button:nth-of-type(" + i + ")").attr("disabled", true);
    }
  }
  //enables all buttons on square
  function enableAll() {
    for (var i = 1; i <= 9; i++) {
      $("button:nth-of-type(" + i + ")").attr("disabled", false);
    }
  }

  //checks to see if all squares have been filled
  function gameOver() {
    return !gameBoard.squares.includes(empty);
  }

  //Did user choose X
  function userChoseX() {
    return gameBoard.userChoseX;
  }

  //determines if the user has won the game
  function userWon() {
    if (userChoseX()) {
      for (var i = 0; i < 8; i++) {
        if (gameBoard.squares.subArray(gameBoard.winningPatterns[i]).all(X)) {
          return true;
        }
      }

      return false;
    } else {
      for (var j = 0; j < 8; j++) {
        if (gameBoard.squares.subArray(gameBoard.winningPatterns[j]).all(O)) {
          return true;
        }
      }
      return false;
    }
  }

  //determines if the computer has won the game
  function computerWon() {
    if (userChoseX()) {
      for (var i = 0; i < 8; i++) {
        if (gameBoard.squares.subArray(gameBoard.winningPatterns[i]).all(O)) {
          return true;
        }
      }
      return false;
    } else {
      for (var j = 0; j < 8; j++) {
        if (gameBoard.squares.subArray(gameBoard.winningPatterns[j]).all(X)) {
          return true;
        }
      }
      return false;
    }
  }

  //clear board by setting all squares to empty
  function clearBoard() {
    gameBoard.squares = [
      empty,
      empty,
      empty,
      empty,
      empty,
      empty,
      empty,
      empty,
      empty
    ];
  }

  //scans the board to determine current status of game
  //has someone won or lost?, is the game over?
  function scanBoard() {
    //if the user won disable all buttons, stop playing and post message saying the user won
    if (userWon()) {
      disableAll();
      updateDisplay();
      stopPlaying();
      userWonMessage();
      //if the user computer won disable all buttons, stop playing and post message saying the computer won
    } else if (computerWon()) {
      disableAll();
      updateDisplay();
      stopPlaying();
      computerWonMessage();
      updateDisplay();

      //if game is over but neither computer or user won then it is a draw
    } else if (gameOver()) {
      disableAll();
      stopPlaying();
      updateDisplay();
      drawMessage();

      //if game is not over yet switch turns
    } else {
      if (usersTurn()) {
        switchTurns();
        computerTurn();
      } else {
        switchTurns();
      }
    }
  }

  //this method updates the array storing the status of each square in the board
  function updateBoard() {
    for (var i = 1; i <= 9; i++) {
      var selectedButton = $("button:nth-of-type(" + i + ")");
      var j = selectedButton.children("i:nth-child(1)").css("z-index");
      var k = selectedButton.children("i:nth-child(2)").css("z-index");
      var l = parseInt(j, 10) + parseInt(k, 10);
      gameBoard.squares[i - 1] = l;
    }
  }

  //update Display-update display of squares based on data stored in gameBoards.squares
  function updateDisplay() {
    for (var i = 1; i <= 9; i++) {
      //square is empty
      if (gameBoard.squares[i - 1] === -2) {
        $("button:nth-of-type(" + i + ")")
          .children("i:nth-child(2)")
          .css("z-index", -1);
        $("button:nth-of-type(" + i + ")")
          .children("i:nth-child(1)")
          .css("z-index", -1);
      } else if (gameBoard.squares[i - 1] === 1) {
        //X in square
        $("button:nth-of-type(" + i + ")")
          .children("i:nth-child(2)")
          .css("z-index", -1);

        $("button:nth-of-type(" + i + ")")
          .children("i:nth-child(1)")
          .css("z-index", 2);
        $("button:nth-of-type(" + i + ")").attr("disabled", true);
      } else {
        $("button:nth-of-type(" + i + ")")
          .children("i:nth-child(2)")
          .css("z-index", 5);

        $("button:nth-of-type(" + i + ")")
          .children("i:nth-child(1)")
          .css("z-index", -1);
        $("button:nth-of-type(" + i + ")").attr("disabled", true);
      }
    }
  }

  //display message when user wins
  function userWonMessage() {
    $("#message").html(
      "Congratulations You Won! :)" +
        "<br>" +
        "<a class='btn btn-success'id='restartGame'>" +
        "Restart Game</a>"
    );

    attachGameReset();
  }

  //display message when computer wins
  function computerWonMessage() {
    $("#message").html(
      "Sorry the computer won :(" +
        "<br>" +
        "<a class='btn btn-success' id='restartGame'>" +
        "Restart Game</a>"
    );

    attachGameReset();
  }

  //display message when neither computer or user wins
  function drawMessage() {
    $("#message").html(
      "It was a draw!" +
        "<br>" +
        "<a class='btn btn-success' id='restartGame'>" +
        "Restart Game</a>"
    );
    attachGameReset();
  }

  //switches variables tracking who's turn it is
  function switchTurns() {
    gameBoard.usersTurn = !gameBoard.usersTurn;
    gameBoard.computersTurn = !gameBoard.usersTurn;
  }

  //turns both players off
  function stopPlaying() {
    gameBoard.usersTurn = gameBoard.computersTurn = false;
  }

  //is it the user's turn
  function usersTurn() {
    return gameBoard.usersTurn;
  }

  //is it the computer's turn
  function computersTurn() {
    return gameBoard.computersTurn;
  }

  //assigns X to the user
  function userisX() {
    gameBoard.userChoseX = true;
  }

  //assigns O to the user
  function userisO() {
    gameBoard.userChoseX = false;
  }

  //event handling for clicking one of the squares on the board
  $("button").click(function() {
    //disable button clicked and assign change z-index to make X or O visible.
    if (userChoseX()) {
      $(this).children("i:nth-child(1)").css("z-index", 2);
      $(this).attr("disabled", true);
    } else {
      $(this).children("i:nth-child(2)").css("z-index", 5);
      $(this).attr("disabled", true);
    }
    updateBoard();
    updateDisplay();
    scanBoard();
  });
});
