export interface ToolExecutionResult {
  tool: string;
  status: 'success' | 'failed';
  result?: number;
  params: Record<string, any>;
  error?: string;
}

export const TOOL_REGISTRY: Record<
  string,
  {
    name: string;
    description: string;
    execute: (params: Record<string, any>) => number;
  }
> = {
  calculate_tax: {
    name: 'calculate_tax',
    description: 'Calculates simple tax given an income. Tax is 15%.',
    execute: (params) => {
      const income = Number(params.income ?? 0);
      return income * 0.15;
    },
  },
  calculate_revenue: {
    name: 'calculate_revenue',
    description: 'Calculates total revenue from operating and other revenue.',
    execute: (params) => {
      const op = Number(params.operating_revenue ?? 0);
      const other = Number(params.other_revenue ?? 0);
      return op + other;
    },
  },
  calculate_expenses: {
    name: 'calculate_expenses',
    description: 'Calculates total expenses from operating and other expenses.',
    execute: (params) => {
      const op = Number(params.operating_expenses ?? 0);
      const other = Number(params.other_expenses ?? 0);
      return op + other;
    },
  },
  calculate_gross_profit: {
    name: 'calculate_gross_profit',
    description: 'Calculates gross profit: Revenue - Cost of Goods Sold (COGS).',
    execute: (params) => {
      const rev = Number(params.revenue ?? 0);
      const cogs = Number(params.cogs ?? 0);
      return rev - cogs;
    },
  },
  calculate_net_profit: {
    name: 'calculate_net_profit',
    description: 'Calculates net profit: Gross Profit - Operating Expenses.',
    execute: (params) => {
      const gross = Number(params.gross_profit ?? 0);
      const opex = Number(params.operating_expenses ?? 0);
      return gross - opex;
    },
  },
  calculate_net_profit_margin: {
    name: 'calculate_net_profit_margin',
    description: 'Calculates net profit margin percentage: (Net Profit / Revenue) * 100.',
    execute: (params) => {
      const net = Number(params.net_profit ?? 0);
      const rev = Number(params.revenue ?? 0);
      if (rev <= 0) {
        throw new Error('Division by zero: revenue must be strictly positive to calculate margin.');
      }
      return (net / rev) * 100.0;
    },
  },
  calculate_working_capital: {
    name: 'calculate_working_capital',
    description: 'Calculates working capital: Current Assets - Current Liabilities.',
    execute: (params) => {
      const ca = Number(params.current_assets ?? 0);
      const cl = Number(params.current_liabilities ?? 0);
      return ca - cl;
    },
  },
  calculate_current_ratio: {
    name: 'calculate_current_ratio',
    description: 'Calculates current ratio: Current Assets / Current Liabilities.',
    execute: (params) => {
      const ca = Number(params.current_assets ?? 0);
      const cl = Number(params.current_liabilities ?? 0);
      if (cl === 0) {
        throw new Error('Division by zero: current liabilities cannot be 0.');
      }
      return ca / cl;
    },
  },
  calculate_debt_to_equity: {
    name: 'calculate_debt_to_equity',
    description: "Calculates debt-to-equity ratio: Total Debt / Shareholders' Equity.",
    execute: (params) => {
      const debt = Number(params.total_debt ?? 0);
      const equity = Number(params.shareholders_equity ?? 0);
      if (equity === 0) {
        throw new Error("Division by zero: shareholders' equity cannot be 0.");
      }
      return debt / equity;
    },
  },
};

export function executeTool(toolName: string, params: Record<string, any>): ToolExecutionResult {
  const tool = TOOL_REGISTRY[toolName];
  if (!tool) {
    return {
      tool: toolName,
      status: 'failed',
      params,
      error: `Tool '${toolName}' not found in registry.`,
    };
  }
  try {
    const res = tool.execute(params);
    return {
      tool: toolName,
      status: 'success',
      result: Number(res.toFixed(4)),
      params,
    };
  } catch (err: any) {
    return {
      tool: toolName,
      status: 'failed',
      params,
      error: err.message || 'Tool execution error',
    };
  }
}
