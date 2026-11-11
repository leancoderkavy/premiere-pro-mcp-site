# YouTube / short-video scripts — dated

Status: **DRAFT — do not record or upload** until explicit approval.  
On-screen CTA: premiere-pro-mcp.com · Mention founder Kavy Rattana once per video max.  
Demo media: synthetic or licensed only—no client projects.

---

### 2026-11-19 — YT 1 · “Safe Premiere connection check” (60–90s short)

**Hook:** Your AI should not edit Premiere until this passes.  
**Visual:** Cursor or Claude Desktop + Premiere with CEP panel open.

**Script:**
1. “I’m Kavy—or you’re watching a Premiere Pro MCP walkthrough. Goal: prove the local bridge works without changing the project.”
2. Show disposable project + active sequence.
3. Paste: Safely check my Premiere connection with verify_premiere_connection. Make no changes.
4. Point at success vs diagnostic. “Success means server + bridge + project + sequence. Not every tool. Not every edit.”
5. CTA: Setup guide for Claude/Cursor on premiere-pro-mcp.com.

**Do not say:** hours saved, “works on every install,” tool-count as proof of quality.

---

### 2026-11-25 — YT 2 · “AI captions without fake styling APIs” (2–4 min)

**Hook:** Build SRT/VTT, import one caption track, style in Premiere.  
**Visual:** Word timeline → artifact preview → caption track in Timeline.

**Script:**
1. Connection check first.
2. “build_caption_artifact needs a word timeline you already trust—it doesn’t invent a finished transcript by itself in this recipe.”
3. Show style_preset choice (podcast/clean/etc.) and cue review.
4. create_caption_track import → confirm one new track.
5. “Styling and Upgrade Caption to Graphic stay manual—get_caption_style_guidance gives the click path.”
6. Optional: check_caption_safe_zone with example rects for Shorts.
7. CTA: captions guide URL.

---

### 2026-11-30 — YT 3 · “Rough cut: plan → preview → apply” (3–5 min)

**Hook:** Stop asking AI to ‘just rough cut it.’  
**Visual:** Duplicate sequence labeled clearly.

**Script:**
1. Inspect sequence.
2. create_editorial_plan workflow rough_cut OR create_context_edit_plan strategy rough_cut—show that nothing moved.
3. preview_edit_plan → show token / targets.
4. Human review beat: wrong track? abort.
5. apply_edit_plan once; re-inspect.
6. Mention UXP transcript rough-cut planning only if you actually have authenticated UXP connected—otherwise skip.
7. CTA: rough cut guide.

---

### 2026-12-05 — YT 4 · “Beat montage plan” (2–3 min)

**Hook:** Rhythm grid first, clips second.  
**Visual:** Waveform / beat list overlay (even text list is fine).

**Script:**
1. detect_beats on approved music bed—read BPM + confidence + half/double note.
2. Listen pass on camera: “Candidate grid, not gospel.”
3. plan_beat_montage—show planned chunk list.
4. Place with add_to_timeline_batch on empty tracks of a duplicate sequence; inspect readback.
5. CTA: beat montage guide.

---

### 2026-12-09 — YT 5 · “Vertical cutdown checklist” (45–75s short)

**On-screen list:**
1. plan_platform_delivery_matrix  
2. auto_reframe_sequence → new sequence  
3. Safe-zone check for captions/titles  
4. validate_project_for_export  
5. export + verify_delivery_file  

**Line:** “Plan fit before you burn renders.”  
CTA: vertical cutdowns guide.

---

### 2026-12-13 — YT 6 · “Agency / YouTube team handoff” (3–5 min)

**Hook:** AI belongs in intake and review—not unsupervised finishing.  
**Visual:** path-redacted intake report, backup file beside .prproj, review frames folder.

**Script:**
1. preview_project_intake on disposable/sanitized project.
2. create_project_backup before first mutation.
3. inspect_sequence_review_report for handoff.
4. export_sequence_review_frames for a bounded range—open 2–3 stills.
5. “Serialize mutating sessions. Humans approve story.”
6. CTA: agencies guide + #install.

**B-roll note:** Prefer synthetic kit media from /workflows/.
