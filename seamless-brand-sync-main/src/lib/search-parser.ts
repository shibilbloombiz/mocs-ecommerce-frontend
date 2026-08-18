export interface ParsedSearchQuery {
  raw: string;
  keyword: string;
  priceMin?: number;
  priceMax?: number;
}

/**
 * Natural language search parser (Amazon / Flipkart style)
 * Parses search strings like:
 *  - "shoes under 500" -> { keyword: "shoes", priceMax: 500 }
 *  - "sandals above 300" -> { keyword: "sandals", priceMin: 300 }
 *  - "shoes between 300 and 600" -> { keyword: "shoes", priceMin: 300, priceMax: 600 }
 *  - "shoes 500" -> { keyword: "shoes 500" } (keyword only)
 */
export function parseSearchQuery(input: string): ParsedSearchQuery {
  if (!input || typeof input !== "string") {
    return { raw: "", keyword: "" };
  }

  const raw = input.trim();
  let workingText = raw;
  let priceMin: number | undefined;
  let priceMax: number | undefined;

  const currPrefix = "(?:₹|rs\\.?|inr|\\$)?\\s*";
  const currSuffix = "\\s*(?:₹|rs\\.?|inr|\\$|rupees|bucks)?";

  // 1. "between X and Y" / "from X to Y" / "X to Y" / "X - Y"
  const betweenRegex = new RegExp(
    `\\b(?:between|from)?\\s*${currPrefix}(\\d+(?:\\.\\d+)?)${currSuffix}\\s+(?:and|to|-)\\s+${currPrefix}(\\d+(?:\\.\\d+)?)${currSuffix}\\b`,
    "i"
  );
  const betweenMatch = workingText.match(betweenRegex);
  if (
    betweenMatch &&
    (betweenMatch[0].toLowerCase().includes("between") ||
      betweenMatch[0].toLowerCase().includes("from") ||
      betweenMatch[0].includes("-") ||
      betweenMatch[0].toLowerCase().includes("to"))
  ) {
    const val1 = parseFloat(betweenMatch[1]);
    const val2 = parseFloat(betweenMatch[2]);
    priceMin = Math.min(val1, val2);
    priceMax = Math.max(val1, val2);
    workingText = workingText.replace(betweenMatch[0], " ");
  }

  // 2. "under X", "below X", "less than X", "within X", "upto X", "up to X", "max X"
  if (priceMax === undefined) {
    const underRegex = new RegExp(
      `\\b(?:under|below|less\\s+than|upto|up\\s+to|within|max(?:imum)?)\\s+${currPrefix}(\\d+(?:\\.\\d+)?)${currSuffix}\\b`,
      "i"
    );
    const underMatch = workingText.match(underRegex);
    if (underMatch) {
      priceMax = parseFloat(underMatch[1]);
      workingText = workingText.replace(underMatch[0], " ");
    }
  }

  // 3. "above X", "over X", "greater than X", "more than X", "min X", "starting from X"
  if (priceMin === undefined) {
    const aboveRegex = new RegExp(
      `\\b(?:above|over|greater\\s+than|more\\s+than|min(?:imum)?|starting\\s+(?:from|at)?)\\s+${currPrefix}(\\d+(?:\\.\\d+)?)${currSuffix}\\b`,
      "i"
    );
    const aboveMatch = workingText.match(aboveRegex);
    if (aboveMatch) {
      priceMin = parseFloat(aboveMatch[1]);
      workingText = workingText.replace(aboveMatch[0], " ");
    }
  }

  // Clean up remaining keyword (remove extra spaces)
  const keyword = workingText.replace(/\s+/g, " ").trim();

  const result: ParsedSearchQuery = {
    raw,
    keyword: keyword || raw,
  };
  if (priceMin !== undefined) result.priceMin = priceMin;
  if (priceMax !== undefined) result.priceMax = priceMax;

  return result;
}
