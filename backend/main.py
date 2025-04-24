# app/main.py
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
USER_PROGRESS = {}

# Models
class WatchedInterval(BaseModel):
    start: int
    end: int

class UpdateProgressPayload(BaseModel):
    user_id: str
    video_id: str
    intervals: List[WatchedInterval]
    video_duration: int

class ProgressResponse(BaseModel):
    progress_percentage: float
    last_position: int

# Utils

def merge_intervals(intervals):
    if not intervals:
        return []

    intervals.sort()
    merged = [intervals[0]]

    for current in intervals[1:]:
        prev_start, prev_end = merged[-1]
        curr_start, curr_end = current

        if curr_start <= prev_end:
            merged[-1] = (prev_start, max(prev_end, curr_end))
        else:
            merged.append(current)

    return merged

def calculate_progress(intervals, duration):
    unique_seconds = sum(end - start for start, end in intervals)
    return (unique_seconds / duration) * 100 if duration else 0

# Services

def update_user_progress(payload: UpdateProgressPayload) -> ProgressResponse:
    key = f"{payload.user_id}:{payload.video_id}"
    new_intervals = [(i.start, i.end) for i in payload.intervals]

    if key not in USER_PROGRESS:
        USER_PROGRESS[key] = {
            "intervals": new_intervals,
            "last_position": max(i.end for i in new_intervals)
        }
    else:
        current = USER_PROGRESS[key]
        all_intervals = current["intervals"] + new_intervals
        merged_intervals = merge_intervals(all_intervals)
        last_position = max(current["last_position"], max(i.end for i in new_intervals))

        USER_PROGRESS[key] = {
            "intervals": merged_intervals,
            "last_position": last_position
        }

    progress = calculate_progress(USER_PROGRESS[key]["intervals"], payload.video_duration)
    return ProgressResponse(progress_percentage=round(progress, 2), last_position=USER_PROGRESS[key]["last_position"])

def get_user_progress(user_id: str, video_id: str, duration: int) -> ProgressResponse:
    key = f"{user_id}:{video_id}"
    if key not in USER_PROGRESS:
        return ProgressResponse(progress_percentage=0.0, last_position=0)

    progress = calculate_progress(USER_PROGRESS[key]["intervals"], duration)
    return ProgressResponse(progress_percentage=round(progress, 2), last_position=USER_PROGRESS[key]["last_position"])

# Routes
router = APIRouter()

@router.post("/update_progress", response_model=ProgressResponse)
def update_progress(payload: UpdateProgressPayload):
    return update_user_progress(payload)

@router.get("/get_progress/{user_id}/{video_id}/{duration}", response_model=ProgressResponse)
def get_progress(user_id: str, video_id: str, duration: int):
    return get_user_progress(user_id, video_id, duration)

app.include_router(router)

# Main
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
