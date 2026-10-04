// BMW Group annual vehicle deliveries (units).
// Approximate figures compiled from BMW Group annual sales press releases.
// Verify against the official BMW Group reports before citing.
// BEV = fully electric BMW + MINI + Rolls-Royce deliveries; null = not shown.
// Replace this dataset, or use "Import CSV" on the dashboard page.
const BMW_DATA = {
  source: "BMW Group annual deliveries press releases (approximate)",
  brands: ["BMW", "MINI", "Rolls-Royce"],
  rows: [
    { year: 2019, "BMW": 2168516, "MINI": 346639, "Rolls-Royce": 5152, "BEV": null },
    { year: 2020, "BMW": 2028659, "MINI": 292582, "Rolls-Royce": 3756, "BEV": 44541 },
    { year: 2021, "BMW": 2213795, "MINI": 302140, "Rolls-Royce": 5586, "BEV": 103855 },
    { year: 2022, "BMW": 2100692, "MINI": 292923, "Rolls-Royce": 6021, "BEV": 215752 },
    { year: 2023, "BMW": 2253835, "MINI": 295358, "Rolls-Royce": 6032, "BEV": 376183 },
    { year: 2024, "BMW": 2200177, "MINI": 244925, "Rolls-Royce": 5712, "BEV": 426594 }
  ]
};
