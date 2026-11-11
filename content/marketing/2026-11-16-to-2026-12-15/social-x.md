# X (Twitter) drafts — dated

Status: **DRAFT — do not post** until explicit approval.  
Product: MCP for Adobe Premiere Pro · Founder: Kavy Rattana  
Links assume guides are live on premiere-pro-mcp.com after an approved merge.

---

### 2026-11-16 — Post 1
AI can drive Adobe Premiere Pro—if the bridge is local, named, and reviewable.

MCP for Adobe Premiere Pro (by Kavy Rattana) lets Claude, Cursor, and other MCP clients call real Premiere tools on your machine.

Start read-only: verify the connection before any edit.

Guide: https://premiere-pro-mcp.com/blog/automate-premiere-pro-with-ai/

---

### 2026-11-18 — Post 2
Same Premiere bridge. Two common clients.

• Claude Desktop → local stdio MCP  
• Cursor → local MCP in Agent  
• Both need the CEP connector beside Premiere

Setup hub: https://premiere-pro-mcp.com/blog/premiere-pro-mcp-setup-claude-cursor/

---

### 2026-11-20 — Post 3
First prompt that should not change anything:

“Safely check my Premiere connection with verify_premiere_connection. Make no changes.”

If that fails, fix the bridge—don’t retry an edit.

---

### 2026-11-22 — Post 4
“Auto-cut silence” is a chain, not a single click.

1. detect_silence (FFmpeg analysis)  
2. Review keep/reject  
3. Preview ripple removal or UXP stringout  
4. Apply only what you approved  

https://premiere-pro-mcp.com/blog/cut-silence-in-premiere-pro-with-ai/

---

### 2026-11-24 — Post 5
Don’t guess which Premiere tools your session has.

Ask for get_capabilities with a keyword: silence, captions, transcript, export.

A listed tool is an advertisement—not a host success receipt.

---

### 2026-11-26 — Post 6
Captions via MCP:

• build_caption_artifact → SRT/VTT from a word timeline  
• create_caption_track → import after review  
• Styling in Premiere UI (no style API)

https://premiere-pro-mcp.com/blog/premiere-pro-ai-captions-workflow/

---

### 2026-11-28 — Post 7
Rough cuts should start as plans.

create_editorial_plan / create_context_edit_plan → preview_edit_plan → apply_edit_plan

Token expires. Targets must still match. Duplicate the sequence first.

https://premiere-pro-mcp.com/blog/premiere-pro-ai-rough-cut-workflow/

---

### 2026-12-01 — Post 8
This month’s Premiere Pro MCP guides (draft pack):

1. Automate with AI  
2. Claude/Cursor setup  
3. Cut silence  
4. Captions  
(+ more landing through Dec 15)

Index: https://premiere-pro-mcp.com/blog/

---

### 2026-12-03 — Post 9
detect_beats gives you a candidate grid (BPM, confidence, half/double alts).

plan_beat_montage plans the montage. It does not place clips until you review and use timeline tools.

https://premiere-pro-mcp.com/blog/premiere-pro-beat-montage-with-mcp/

---

### 2026-12-06 — Post 10
Placing a montage plan?

add_to_timeline_batch: up to 32 items, preflight + readback.

Changed placements can return committed_unverified—inspect before the next batch.

---

### 2026-12-08 — Post 11
Vertical cutdowns: plan the matrix before you reframe.

plan_platform_delivery_matrix → auto_reframe_sequence → safe-zone check → export preflight

https://premiere-pro-mcp.com/blog/premiere-pro-vertical-cutdowns-with-mcp/

---

### 2026-12-11 — Post 12
validate_project_for_export saying readyForExport ≠ “the encoder finished.”

Still need export_sequence (or AME job) + verify_delivery_file when the file matters.

---

### 2026-12-15 — Optional recap
Month pack for editors & YouTube teams: silence, captions, rough cuts, beats, verticals, agency handoffs.

Built for reviewable local MCP—not vibes.

https://premiere-pro-mcp.com/blog/
https://premiere-pro-mcp.com/#install
