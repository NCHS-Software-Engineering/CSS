export interface PointsResponse {
  id: string;
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    gridId: string;           // e.g., "LOT" or "LWX"
    gridX: number;
    gridY: number;
    forecast: string;         // URL for 12-hour forecast periods
    forecastHourly: string;   // URL for hourly forecast periods
    forecastGridData: string; // URL for raw numerical grid data
    observationStations: string;
    forecastZone: string;
    county: string;
    timeZone: string;
    radarStation: string;
    relativeLocation: {
      type: "Feature";
      properties: {
        city: string;
        state: string;
      };
    };
  };
}
export interface QuantitativeValue {
  unitCode: string; // e.g., "wmoUnit:percent" or "wmoUnit:degC"
  value: number | null;
}

export interface ForecastPeriod {
  number: number;               // Sequential index starting at 1
  name: string;                 // e.g., "Tonight", "Saturday" (empty string in hourly)
  startTime: string;            // ISO 8601 timestamp
  endTime: string;              // ISO 8601 timestamp
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: "F" | "C";
  temperatureTrend: "rising" | "falling" | null;
  probabilityOfPrecipitation: QuantitativeValue;
  dewpoint?: QuantitativeValue;        // Included in hourly forecasts
  relativeHumidity?: QuantitativeValue; // Included in hourly forecasts
  windSpeed: string;            // e.g., "10 to 15 mph"
  windDirection: string;        // e.g., "NW"
  icon: string;                 // URL to NWS weather icon
  shortForecast: string;        // Brief summary, e.g., "Partly Cloudy"
  detailedForecast: string;     // Full text description (empty in hourly)
}

export interface ForecastResponse {
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
  properties: {
    units: "us" | "si";
    forecastGenerator: string;
    generatedAt: string;        // ISO 8601 timestamp
    updateTime: string;         // ISO 8601 timestamp
    validTimes: string;         // ISO 8601 time interval
    elevation: QuantitativeValue;
    periods: ForecastPeriod[];
  };
}
