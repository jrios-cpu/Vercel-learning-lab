export const CONFIGURATOR_STEPS = ["Application", "Product Line", "Configuration", "Accessories", "Project Details"] as const;

export type ConfiguratorState = {
  step: 1 | 2 | 3 | 4 | 5;
  application: string;
  productLine: string;
  partNumbers: string[];
  selections: Record<string, string>;
  accessories: string[];
  quantity: number;
  targetTimeline: string;
  notes: string;
};

export type ConfiguratorAction =
  | { type: "SET_APPLICATION"; value: string }
  | { type: "SET_PRODUCT_LINE"; value: string }
  | { type: "SET_PART_NUMBER"; value: string }
  | { type: "SET_SELECTION"; key: string; value: string }
  | { type: "TOGGLE_ACCESSORY"; value: string }
  | { type: "SET_QUANTITY"; value: number }
  | { type: "SET_TIMELINE"; value: string }
  | { type: "SET_NOTES"; value: string }
  | { type: "PRELOAD_PRODUCT"; productLine: string; partNumber: string; finish?: string }
  | { type: "RESTORE"; state: ConfiguratorState }
  | { type: "GO_TO"; step: ConfiguratorState["step"] }
  | { type: "NEXT" }
  | { type: "BACK" };

export const initialConfiguratorState: ConfiguratorState = {
  step: 1,
  application: "",
  productLine: "",
  partNumbers: [],
  selections: {},
  accessories: [],
  quantity: 1,
  targetTimeline: "",
  notes: "",
};

export function canAdvance(state: ConfiguratorState) {
  if (state.step === 1) return Boolean(state.application);
  if (state.step === 2) return Boolean(state.productLine && state.partNumbers.length);
  if (state.step === 3) return Boolean(state.partNumbers.length);
  if (state.step === 4) return true;
  return false;
}

export function configuratorReducer(state: ConfiguratorState, action: ConfiguratorAction): ConfiguratorState {
  switch (action.type) {
    case "SET_APPLICATION": return { ...state, application: action.value };
    case "SET_PRODUCT_LINE": return { ...state, productLine: action.value, partNumbers: [], selections: {} };
    case "SET_PART_NUMBER": return { ...state, partNumbers: action.value ? [action.value] : [] };
    case "SET_SELECTION": return { ...state, selections: { ...state.selections, [action.key]: action.value } };
    case "TOGGLE_ACCESSORY": return { ...state, accessories: state.accessories.includes(action.value) ? state.accessories.filter((item) => item !== action.value) : [...state.accessories, action.value] };
    case "SET_QUANTITY": return { ...state, quantity: Number.isFinite(action.value) ? Math.min(100000, Math.max(1, Math.round(action.value))) : 1 };
    case "SET_TIMELINE": return { ...state, targetTimeline: action.value };
    case "SET_NOTES": return { ...state, notes: action.value };
    case "PRELOAD_PRODUCT": return { ...state, productLine: action.productLine, partNumbers: [action.partNumber], selections: action.finish ? { ...state.selections, finish: action.finish } : state.selections };
    case "RESTORE": return { ...action.state, step: Math.min(5, Math.max(1, action.state.step)) as ConfiguratorState["step"], quantity: Math.min(100000, Math.max(1, Math.round(action.state.quantity || 1))) };
    case "GO_TO": return action.step <= state.step ? { ...state, step: action.step } : state;
    case "NEXT": return canAdvance(state) ? { ...state, step: Math.min(5, state.step + 1) as ConfiguratorState["step"] } : state;
    case "BACK": return { ...state, step: Math.max(1, state.step - 1) as ConfiguratorState["step"] };
    default: return state;
  }
}
