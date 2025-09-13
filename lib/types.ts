import { type } from "os";

// Core data types
export interface Aporte {
  id: string;
  value: number;
}

export interface StudentData {
  aportes: Aporte[]; // Now an array of Aporte objects
  isEnMora: boolean;
  index: number;
}

export interface HexagonData {
  x: number;
  y: number;
  size: number;
  studentIndex: number;
  aporteId: string; // The unique ID of the aporte this hexagon represents
  hasData: boolean;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface PaymentStats {
  mora: {
    sum: number;
    count: number;
    formatted: string;
  };
  donaciones: {
    sum: number;
    count: number;
    formatted: string;
  };
  becas: {
    sum: number;
    count: number;
    formatted: string;
  };
}

export interface ColorStop {
  h: number;
  s: number;
  l: number;
}
