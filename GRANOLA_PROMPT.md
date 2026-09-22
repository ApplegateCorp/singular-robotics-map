# Prompt to send colleagues

Send this to anyone at Singular who has met robotics companies. They run it on their own Claude
with Granola connected, then send you the JSON. You paste it into "Import from Granola" on the map.

---

You have access to my Granola meeting notes. Go through every meeting I attended in the last 12
months and find every robotics, physical AI, embodied AI, automation, autonomous systems or drone
COMPANY I met with. Exclude VC funds, investors, LPs and internal meetings.

Return ONLY a JSON array, no prose before or after, no markdown fences. One object per company,
using exactly these keys:

```
[
  {
    "name": "Company name",
    "url": "https://company.com",
    "category": "hardware | components | models | data | deployment | applications",
    "vertical": "Warehouse | Manufacturing | Humanoid | Defence | Maritime | Retail | Infrastructure | ...",
    "country": "Germany",
    "description": "One sentence on what they actually do.",
    "met": "team",
    "met_by": "YOUR FULL NAME",
    "met_date": "2026-03-14",
    "notes": "Traction, unit economics, why they matter, or why you passed.",
    "source": "granola"
  }
]
```

Category definitions:
- `hardware` builds the robot itself
- `components` actuators, sensors, safety compute, subsystems
- `models` foundation models, VLAs, autonomy software
- `data` data collection, simulation, evaluation, benchmarking
- `deployment` fleet management, integration, teleoperation, robot programming
- `applications` end-to-end operators solving a specific vertical problem

Always set `met` to `team` and `met_by` to your own name. Use `""` for anything you genuinely do
not know, never invent a fact. Send the resulting JSON to Augustin.

---

The same prompt is built into the app, under "Import from Granola", with a copy button.
