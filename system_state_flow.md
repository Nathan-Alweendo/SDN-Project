# System State Flow

## States
1. **Offline** – User actions are stored locally in the SyncQueue.
2. **Pending Sync** – Once internet is detected, unsent records wait in the queue.
3. **Synced** – Records are successfully uploaded and marked complete.
4. **Conflict Detected** – Overlapping changes flagged for facilitator review.

## Recovery Guidance
- Retry sync
- Check offline records
- Escalate to team support

## Traceability
Requirement: Offline resilience → Prototype SyncQueue → Evaluation feedback
