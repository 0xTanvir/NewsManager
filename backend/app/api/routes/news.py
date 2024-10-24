from typing import List, Optional, Any

from fastapi import APIRouter, HTTPException, status, Query
from sqlmodel import select, func
from sqlalchemy.exc import IntegrityError

from app.api.deps import SessionDep
from app.models import (
    News,
    NewsCreate,
    NewsUpdate,
    NewsPublic,
    NewsList,
    Message
)

router = APIRouter()


@router.post("/", response_model=NewsPublic, status_code=status.HTTP_201_CREATED)
def create_news(
    *,
    session: SessionDep,
    news_in: NewsCreate
) -> Any:
    """
    Add one news article.
    """
    # Ensure the ID is provided and meets length constraints
    if not news_in.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID must be provided by the client."
        )
    if len(news_in.id) > 255:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID exceeds maximum length of 255 characters."
        )
    
    news = News(
        id=news_in.id,
        source_name=news_in.source_name,
        category=news_in.category,
        headline=news_in.headline,
        story=news_in.story,
        published_at=news_in.published_at,
        image_link=news_in.image_link,
        source_link=news_in.source_link,
        meta_description=news_in.meta_description,
        meta_keywords=news_in.meta_keywords
    )
    session.add(news)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="News article with this ID already exists."
        )
    session.refresh(news)
    return news


@router.post("/bulk", response_model=List[NewsPublic], status_code=status.HTTP_201_CREATED)
def bulk_create_news(
    *,
    session: SessionDep,
    news_list: List[NewsCreate]
) -> Any:
    """
    Add multiple news articles.
    """
    created_news = []
    for news_in in news_list:
        # Ensure the ID is provided and meets length constraints
        if not news_in.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Each news article must have an ID provided by the client."
            )
        if len(news_in.id) > 255:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"ID exceeds maximum length of 255 characters: {news_in.id}"
            )
        
        news = News(
            id=news_in.id,
            source_name=news_in.source_name,
            category=news_in.category,
            headline=news_in.headline,
            story=news_in.story,
            published_at=news_in.published_at,
            image_link=news_in.image_link,
            source_link=news_in.source_link,
            meta_description=news_in.meta_description,
            meta_keywords=news_in.meta_keywords
        )
        session.add(news)
        created_news.append(news)
    
    try:
        session.commit()
    except IntegrityError as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"One or more news articles have duplicate IDs or invalid data. Error: {str(e)}"
        )
    
    for news in created_news:
        session.refresh(news)
    
    return created_news


@router.get("/", response_model=NewsList)
def read_news(
    *,
    session: SessionDep,
    limit: int = Query(20, ge=1),
    offset: int = Query(0, ge=0),
    query: Optional[str] = None,
    sort: Optional[str] = "published_at",
    order: Optional[str] = "asc",
    category: Optional[str] = None,   # New parameter for category
    source_name: Optional[str] = None  # New parameter for source_name
) -> Any:
    """
    Retrieve all news articles with optional filters for headline, category, and source_name.
    """
    # Start building the base query
    statement = select(News)

    # Filter by headline if 'query' is provided
    if query:
        statement = statement.where(News.headline.ilike(f"%{query}%"))

    # Filter by category if provided
    if category:
        statement = statement.where(News.category == category)

    # Filter by source_name if provided
    if source_name:
        statement = statement.where(News.source_name == source_name)

    # Ensure the sort field exists in the News model
    if sort not in News.__fields__:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot sort by unknown field: {sort}"
        )

    # Set the sort order
    sort_column = getattr(News, sort)
    if order.lower() == "desc":
        sort_column = sort_column.desc()
    else:
        sort_column = sort_column.asc()

    # Apply sorting, offset, and limit to the query
    statement = statement.order_by(sort_column).offset(offset).limit(limit)

    # Execute the query to get the news articles
    items = session.exec(statement).all()

    # Prepare the count query
    count_statement = select(func.count()).select_from(News)

    # Apply filters to the count query
    if query:
        count_statement = count_statement.where(News.headline.ilike(f"%{query}%"))
    if category:
        count_statement = count_statement.where(News.category == category)
    if source_name:
        count_statement = count_statement.where(News.source_name == source_name)

    # Get the total count of articles matching the filters
    total_count = session.exec(count_statement).one()

    # Return the filtered news articles and the total count
    return NewsList(data=items, count=total_count)


@router.get("/{id:path}", response_model=NewsPublic)
def read_news_article(
    *,
    session: SessionDep,
    id: str
) -> Any:
    """
    Retrieve a single news article by ID.
    """
    if len(id) > 255:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID exceeds maximum length of 255 characters."
        )

    news = session.get(News, id)
    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News article not found."
        )
    return news


@router.put("/{id:path}", response_model=NewsPublic)
def update_news_article(
    *,
    session: SessionDep,
    id: str,
    news_in: NewsUpdate
) -> Any:
    """
    Update a news article by ID.
    """
    if len(id) > 255:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID exceeds maximum length of 255 characters."
        )

    news = session.get(News, id)
    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News article not found."
        )

    update_data = news_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(news, key, value)

    session.add(news)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update news article due to integrity constraints."
        )
    session.refresh(news)
    return news


@router.delete("/{id:path}", response_model=Message)
def delete_news_article(
    *,
    session: SessionDep,
    id: str
) -> Any:
    """
    Delete a news article by ID.
    """
    print(f"id", id)
    if len(id) > 255:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID exceeds maximum length of 255 characters."
        )

    news = session.get(News, id)
    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News article not found."
        )

    session.delete(news)
    session.commit()
    return Message(message="News article deleted successfully.")