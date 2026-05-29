from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from database import get_db
from typing import Optional, List
import models

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("/")
def get_leaderboard(
    fish_type: str = Query(...),
    period: str = Query("monthly"),
    year: int = Query(...),
    month: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(
        models.User.username,
        func.max(models.Catch.weight_kg).label("biggest_catch"),
        func.count(models.Catch.id).label("total_catches")
    ).join(models.User).filter(
        models.Catch.fish_type == fish_type
    )

    if month:
        query = query.filter(
            extract("year", models.Catch.caught_at) == year,
            extract("month", models.Catch.caught_at) == month
        )
    else:
        query = query.filter(
            extract("year", models.Catch.caught_at) == year
        )

    results = query.group_by(models.User.username)\
                   .order_by(func.max(models.Catch.weight_kg).desc())\
                   .limit(5)\
                   .all()

    return [
        {
            "rank": i + 1,
            "username": r.username,
            "biggest_catch_kg": r.biggest_catch,
            "total_catches": r.total_catches
        }
        for i, r in enumerate(results)
    ]