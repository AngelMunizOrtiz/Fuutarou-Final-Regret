# Chapter 01 Background References

Goal: keep this folder focused on background references only. Character sprites should live in a shared character library so they can be reused across chapters.

## Chapter Scope

Chapter 1 starts with the existing dream sequence, then moves to Fuutarou's university life after he says "I had that dream again." The wakeup room can be handled separately later. The main production focus for this chapter is Tokyo University life with Takeda, plus the optional extra scene at their residence restroom.

Later story text confirms Fuutarou is in his first year at Tokyo University. Chapter 1 says he walks back from afternoon classes and then "they went back to their dorm", so the safest visual reading is: university campus + student residence/dorm life. The room itself can still look like a rented student room, because the text does not require a formal on-campus dorm building.

## Background Set

### 01_university_walkway_afternoon
- Use for: "1 Year After Graduation", Fuutarou walking back from afternoon classes, Takeda catching up.
- Mood: warm campus afternoon, everyday life returning after a tense dream.
- Composition: long walkway or campus path, trees/buildings, open center for two sprites.
- Notes: this is the main chapter 1 background.

### 02_university_walkway_comedy_variant
- Use for: Takeda falling to the ground, sparkles, question-mark gag.
- Mood: same place as 02, but framed lower/wider for physical comedy.
- Composition: visible ground/path area where a fall effect can read clearly.
- Notes: this can also be just 02 plus programmed VFX if we want to save art time.

### 03_student_residence_approach_afternoon
- Use for: "As they went back to their dorm", Fuutarou thinking about the dream while walking with Takeda.
- Mood: reflective, late-afternoon campus/dorm exterior.
- Composition: student residence building, apartment-like dorm entrance, or campus-adjacent lodging in the distance, warmer shadows.
- Notes: optional but helps separate the serious denial/regret conversation from the opening campus gag.

### 04_student_residence_restroom_extra
- Use for: Chapter 1 Extra, Takeda following Fuutarou to the restroom.
- Mood: comedic, simple interior.
- Composition: restroom entrance or stall corridor, keep it tasteful and visual novel friendly.
- Notes: optional for the main route, useful if the extra stays playable.

## Optional Cut-Ins

These are not full backgrounds, but small images or overlays that could make the chapter feel more polished:

- notebook_notes_closeup: Fuutarou reviewing class notes.
- takeda_sparkle_overlay: reusable VFX layer for Takeda.
- bakery_memory_soft_overlay: brief warm flashback when Fuutarou mentions extra help at another bakery.

## Suggested Final Asset Names

- public/images/backgrounds/chapter_01/university_tokyo_establishing.png
- public/images/backgrounds/chapter_01/fuutarou_notes_closeup.png
- public/images/backgrounds/chapter_01/university_walkway_afternoon.png
- public/images/backgrounds/chapter_01/takeda_collapse_cg.png
- public/images/backgrounds/chapter_01/arched_passage_afternoon.png
- public/images/backgrounds/chapter_01/student_residence_approach_afternoon.png
- public/images/backgrounds/chapter_01/student_residence_restroom_extra.png

## Current Flow Placement

- chapter_1_context: university_tokyo_establishing.png with an adaptable info card.
- chapter_1_notes: fuutarou_notes_closeup.png with editable handwritten note overlay.
- chapter_1_after_notes opening: university_walkway_afternoon.png.
- Takeda exhaustion gag: takeda_collapse_cg.png.
- Regret/denial conversation: arched_passage_afternoon.png.
- Vacation/hot springs reminder near residence: student_residence_approach_afternoon.png.
- Chapter 1 Extra: student_residence_restroom_extra.png.
