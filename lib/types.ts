// Core data types
export interface StudentData {
  aporte: number;
  isEnMora: boolean;
  index: number;
}

export interface HexagonData {
  x: number;
  y: number;
  size: number;
  dataIndex: number;
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
