import {
  functionalUpdate,
  makeStateUpdater,
  OnChangeFn,
  RowData,
  Table,
  TableFeature,
  Updater,
} from "@tanstack/react-table";

export interface CustomTableState {
  showHighlights: boolean;
  showSmartScores: boolean;
}

export interface CustomOptions {
  onShowHighlightsChange?: OnChangeFn<boolean>;
  onShowSmartScoresChange?: OnChangeFn<boolean>;
}

export interface CustomInstance {
  setShowHighlights: (updater: Updater<boolean>) => void;
  toggleHighlights: () => void;
  setShowSmartScores: (updater: Updater<boolean>) => void;
  toggleSmartScores: () => void;
}

declare module "@tanstack/react-table" {
  // Merge custom state with the existing table state
  interface TableState extends CustomTableState {}
  // Merge custom options with the existing table options
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableOptionsResolved<TData extends RowData> extends CustomOptions {}
  // Merge custom instance APIs with the existing table instance APIs
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Table<TData extends RowData> extends CustomInstance {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomFeature: TableFeature<any> = {
  // Define the initial state
  getInitialState: (state): CustomTableState => {
    return {
      showHighlights: true,
      showSmartScores: false,
      ...state,
    };
  },

  // Define the default options
  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): CustomOptions => {
    return {
      onShowHighlightsChange: makeStateUpdater("showHighlights", table),
      onShowSmartScoresChange: makeStateUpdater("showSmartScores", table),
    } as CustomOptions;
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setShowHighlights = (updater) => {
      const safeUpdater: Updater<boolean> = (old) => {
        const newState = functionalUpdate(updater, old);
        return newState;
      };
      return table.options.onShowHighlightsChange?.(safeUpdater);
    };

    table.toggleHighlights = () => {
      table.setShowHighlights((old) => !old);
    };

    table.setShowSmartScores = (updater) => {
      const safeUpdater: Updater<boolean> = (old) => {
        const newState = functionalUpdate(updater, old);
        return newState;
      };
      return table.options.onShowSmartScoresChange?.(safeUpdater);
    };

    table.toggleSmartScores = () => {
      table.setShowSmartScores((old) => !old);
    };
  },
};

export default CustomFeature;
