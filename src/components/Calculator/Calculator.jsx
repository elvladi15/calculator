import React, { useReducer } from "react";
import DigitButton from "../DigitButton";
import OperationButton from "../OperationButton";
import "./Calculator.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
};
const evaluate = (state) => {
  const previous = parseFloat(state.previousOperant);
  const current = parseFloat(state.currentOperant);
  if (state.operation === "+") {
    return (previous + current).toString();
  } else if (state.operation === "-") {
    return (previous - current).toString();
  } else if (state.operation === "x") {
    return (previous * current).toString();
  } else if (state.operation === "÷") {
    return (previous / current).toString();
  }
};
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null) {
    return;
  }
  const [integer, decimal] = operand.split(".");
  if (decimal == null) {
    return INTEGER_FORMATTER.format(integer);
  }
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}
function reducer(state, { type, payload }) {
  if (type === ACTIONS.ADD_DIGIT) {
    if (state.overwrite) {
      return {
        ...state,
        overwrite: false,
        currentOperant: payload.digit,
      };
    }
    if (payload.digit === "0" && state.currentOperant === "0") {
      return state;
    }
    if (payload.digit === ".") {
      if (!state.currentOperant) {
        return {
          ...state,
          currentOperant: "0.",
        };
      }
      if (state.currentOperant.includes(".")) {
        return state;
      }
    }
    return {
      ...state,
      currentOperant: `${state.currentOperant || ""}${payload.digit}`,
    };
  } else if (type === ACTIONS.CLEAR) {
    return {};
  } else if (type === ACTIONS.DELETE_DIGIT) {
    if (state.overwrite) {
      return {
        ...state,
        overwrite: false,
        currentOperant: null,
      };
    }
    if (state.currentOperant) {
      return {
        ...state,
        currentOperant: state.currentOperant.slice(0, -1),
      };
    }
    return state;
  } else if (type === ACTIONS.CHOOSE_OPERATION) {
    if (!state.previousOperant) {
      if (!state.currentOperant) {
        return state;
      }
      return {
        operation: payload.operation,
        previousOperant: parseFloat(state.currentOperant),
        currentOperant: null,
      };
    } else if (!state.currentOperant) {
      return {
        ...state,
        operation: payload.operation,
      };
    }
    return {
      operation: payload.operation,
      previousOperant: parseFloat(evaluate(state)),
      currentOperant: null,
    };
  } else if (type === ACTIONS.EVALUATE) {
    if (state.operation && state.currentOperant) {
      return {
        ...state,
        overwrite: true,
        operation: null,
        previousOperant: null,
        currentOperant: evaluate(state),
      };
    }
  }
  return state;
}

export default function Calculator() {
  const [{ currentOperant, previousOperant, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="calculator">
      <div className="top-display">
        <p className="previous-display">
          {previousOperant ? formatOperand(previousOperant.toString()) : null}{" "}
          {operation}
        </p>
        <p className="current-display">{formatOperand(currentOperant)}</p>
      </div>
      <div className="buttons">
        <button
          className="span-2"
          onClick={() => {
            dispatch({ type: ACTIONS.CLEAR });
          }}
        >
          AC
        </button>
        <button
          onClick={() => {
            dispatch({ type: ACTIONS.DELETE_DIGIT });
          }}
        >
          DEL
        </button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="x" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          className="span-2"
          onClick={() => {
            dispatch({ type: ACTIONS.EVALUATE });
          }}
        >
          =
        </button>
      </div>
    </div>
  );
}
