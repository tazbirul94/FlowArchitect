# FlowArchitect

Each agent writes to staging/{slug}/ — Documentation Agent reads all 6 staging files, no agent cross-loads.

  ---
  Usage

  cd orchestrator
  pip install -r requirements.txt

  # Smoke test first (no API calls)
  python test_prompts.py

  # Single concept
  python orchestrator.py --concept "Load Balancer"

  # Full phase
  python orchestrator.py --phase 2

  # Dry run to see plan
  python orchestrator.py --phase 2 --dry-run

  # Resume after interruption
  python orchestrator.py --phase 2 --resume-from "REST"

  # Custom batch size
  python orchestrator.py --phase 2 --batch-size 4

  Need ANTHROPIC_API_KEY in env. Uses Haiku for Wave 2 (6 parallel cheap workers) and Sonnet for Generator/Reviewer/Documentation
  (quality-critical).
