-- Enable btree_gist extension for scalar types with GiST
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Constraint: A trainer cannot have overlapping sessions
-- Requires: instructorId IS NOT NULL
-- We use tsrange(startTime, endTime) && to check for overlaps
-- We use instructorId = to check for same trainer

ALTER TABLE "ClassSession"
ADD CONSTRAINT no_trainer_overlap
EXCLUDE USING gist (
  "instructorId" WITH =,
  tsrange("startTime", "endTime") WITH &&
) WHERE ("instructorId" IS NOT NULL);

-- Constraint: A Room (if we had Room resource) cannot have overlap
-- ALTER TABLE "ClassSession"
-- ADD CONSTRAINT no_room_overlap
-- EXCLUDE USING gist (
--   "roomId" WITH =,
--   tsrange("startTime", "endTime") WITH &&
-- );
