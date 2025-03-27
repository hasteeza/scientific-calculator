"use client";

import { useState } from "react";

const Button = ({ className, onClick, children }) => {
  return (
    <button
      className={`px-3 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(true);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [pendingValue, setPendingValue] = useState(null);
  const [isRadianMode, setIsRadianMode] = useState(true);
  const [lastValue, setLastValue] = useState(null);

  const clearAll = () => {
    setDisplay("0");
    setWaitingForOperand(true);
    setPendingOperator(null);
    setPendingValue(null);
  };

  const clearEntry = () => {
    setDisplay("0");
    setWaitingForOperand(true);
  };

  const digitPressed = (digit) => {
    let newDisplay = display;

    if ((display === "0" && digit !== ".") || waitingForOperand) {
      newDisplay = digit;
      setWaitingForOperand(false);
    } else {
      if (digit === "." && display.includes(".")) {
        return;
      }
      newDisplay = display + digit;
    }

    setDisplay(newDisplay);
  };

  const unaryOperationPressed = (operation) => {
    const value = Number.parseFloat(display);
    let result = 0;

    switch (operation) {
      case "sqrt":
        if (value < 0) {
          setDisplay("Error");
          setWaitingForOperand(true);
          return;
        }
        result = Math.sqrt(value);
        break;
      case "square":
        result = value * value;
        break;
      case "reciprocal":
        if (value === 0) {
          setDisplay("Error");
          setWaitingForOperand(true);
          return;
        }
        result = 1 / value;
        break;
      case "negate":
        result = -value;
        break;
      case "sin":
        result = isRadianMode
          ? Math.sin(value)
          : Math.sin((value * Math.PI) / 180);
        break;
      case "cos":
        result = isRadianMode
          ? Math.cos(value)
          : Math.cos((value * Math.PI) / 180);
        break;
      case "tan":
        result = isRadianMode
          ? Math.tan(value)
          : Math.tan((value * Math.PI) / 180);
        break;
      case "log":
        if (value <= 0) {
          setDisplay("Error");
          setWaitingForOperand(true);
          return;
        }
        result = Math.log10(value);
        break;
      case "ln":
        if (value <= 0) {
          setDisplay("Error");
          setWaitingForOperand(true);
          return;
        }
        result = Math.log(value);
        break;
      case "percent":
        result = value / 100;
        break;
      case "exp":
        result = Math.exp(value);
        break;
      case "factorial":
        if (value < 0 || !Number.isInteger(value)) {
          setDisplay("Error");
          setWaitingForOperand(true);
          return;
        }
        result = factorial(value);
        break;
      default:
        return;
    }

    setDisplay(result.toString());
    setLastValue(result);
    setWaitingForOperand(true);
  };

  // Calculate factorial
  const factorial = (n) => {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const binaryOperationPressed = (operator) => {
    const operand = Number.parseFloat(display);

    if (pendingValue === null) {
      setPendingValue(operand);
    } else if (pendingOperator) {
      const result = calculate(pendingValue, operand, pendingOperator);
      setPendingValue(result);
      setDisplay(result.toString());
    }

    setWaitingForOperand(true);
    setPendingOperator(operator);
  };

  const calculate = (operand1, operand2, operator) => {
    switch (operator) {
      case "+":
        return operand1 + operand2;
      case "-":
        return operand1 - operand2;
      case "×":
        return operand1 * operand2;
      case "÷":
        if (operand2 === 0) {
          setDisplay("Error");
          setWaitingForOperand(true);
          throw new Error("Division by zero");
        }
        return operand1 / operand2;
      case "^":
        return Math.pow(operand1, operand2);
      default:
        throw new Error("Unknown operator");
    }
  };

  const equalsPressed = () => {
    const operand = Number.parseFloat(display);

    if (pendingOperator && pendingValue !== null) {
      try {
        const result = calculate(pendingValue, operand, pendingOperator);
        setDisplay(result.toString());
        setLastValue(result);
        setPendingValue(null);
        setPendingOperator(null);
      } catch (error) {}
    }
    setWaitingForOperand(true);
  };

  // Handle memory operations
  const memoryOperation = (operation) => {
    const value = Number.parseFloat(display);

    switch (operation) {
      case "MC":
        setMemory(null);
        break;
      case "MR":
        if (memory !== null) {
          setDisplay(memory.toString());
          setWaitingForOperand(true);
        }
        break;
      case "M+":
        setMemory((prev) => (prev !== null ? prev + value : value));
        setWaitingForOperand(true);
        break;
      case "M-":
        setMemory((prev) => (prev !== null ? prev - value : -value));
        setWaitingForOperand(true);
        break;
    }
  };

  const constantPressed = (constant) => {
    switch (constant) {
      case "π":
        setDisplay(Math.PI.toString());
        break;
      case "e":
        setDisplay(Math.E.toString());
        break;
    }
    setWaitingForOperand(true);
  };

  const toggleMode = () => {
    setIsRadianMode(!isRadianMode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-gradient-to-tr from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md transform transition-all duration-300">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 mb-6 rounded-xl border border-gray-700 text-right shadow-inner">
          <div className="text-xs text-gray-400 mb-1 flex justify-between">
            <span>
              {memory !== null ? "M" : ""} {isRadianMode ? "RAD" : "DEG"}
            </span>
            {pendingOperator && (
              <span>
                {pendingOperator} {pendingValue}
              </span>
            )}
          </div>
          <div className="text-white text-3xl font-mono overflow-x-auto whitespace-nowrap tracking-wider">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => memoryOperation("MC")}
          >
            MC
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => memoryOperation("MR")}
          >
            MR
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => memoryOperation("M+")}
          >
            M+
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => memoryOperation("M-")}
          >
            M-
          </Button>
          <Button
            className="bg-red-700 hover:bg-red-600 text-white hover:text-red-100 transition-all duration-200"
            onClick={clearAll}
          >
            AC
          </Button>

          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => unaryOperationPressed("sin")}
          >
            sin
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => unaryOperationPressed("cos")}
          >
            cos
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => unaryOperationPressed("tan")}
          >
            tan
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => constantPressed("π")}
          >
            π
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => constantPressed("e")}
          >
            e
          </Button>

          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => unaryOperationPressed("log")}
          >
            log
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => unaryOperationPressed("ln")}
          >
            ln
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => unaryOperationPressed("exp")}
          >
            exp
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => unaryOperationPressed("factorial")}
          >
            x!
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={toggleMode}
          >
            {isRadianMode ? "RAD" : "DEG"}
          </Button>

          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => unaryOperationPressed("square")}
          >
            x²
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => binaryOperationPressed("^")}
          >
            x^y
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => unaryOperationPressed("sqrt")}
          >
            √
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => unaryOperationPressed("reciprocal")}
          >
            1/x
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => unaryOperationPressed("percent")}
          >
            %
          </Button>

          <Button
            className="bg-gray-600 hover:bg-gray-500 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => digitPressed("7")}
          >
            7
          </Button>
          <Button
            className="bg-gray-600 hover:bg-gray-500 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => digitPressed("8")}
          >
            8
          </Button>
          <Button
            className="bg-gray-600 hover:bg-gray-500 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => digitPressed("9")}
          >
            9
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={clearEntry}
          >
            CE
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => binaryOperationPressed("÷")}
          >
            ÷
          </Button>

          <Button
            className="bg-gray-600 hover:bg-gray-500 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => digitPressed("4")}
          >
            4
          </Button>
          <Button
            className="bg-gray-600 hover:bg-gray-500 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => digitPressed("5")}
          >
            5
          </Button>
          <Button
            className="bg-gray-600 hover:bg-gray-500 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => digitPressed("6")}
          >
            6
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => unaryOperationPressed("negate")}
          >
            ±
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => binaryOperationPressed("×")}
          >
            ×
          </Button>

          <Button
            className="bg-gray-600 hover:bg-gray-500 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => digitPressed("1")}
          >
            1
          </Button>
          <Button
            className="bg-gray-600 hover:bg-gray-500 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => digitPressed("2")}
          >
            2
          </Button>
          <Button
            className="bg-gray-600 hover:bg-gray-500 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => digitPressed("3")}
          >
            3
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200 row-span-2"
            onClick={equalsPressed}
          >
            =
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => binaryOperationPressed("-")}
          >
            -
          </Button>

          <Button
            className="bg-gray-600 hover:bg-gray-500 text-white hover:text-blue-200 transition-all duration-200 col-span-2"
            onClick={() => digitPressed("0")}
          >
            0
          </Button>
          <Button
            className="bg-gray-600 hover:bg-gray-500 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => digitPressed(".")}
          >
            .
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-200 transition-all duration-200"
            onClick={() => binaryOperationPressed("+")}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
}
