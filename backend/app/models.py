from sqlmodel import SQLModel, Field
from datetime import datetime

# Shared properties
class NewsBase(SQLModel):
    source_name: str | None = Field(default=None, max_length=255)
    category: str | None = Field(default=None, max_length=255)
    headline: str | None = Field(default=None, max_length=255)
    story: str | None = Field(default=None)
    published_at: datetime | None = Field(default=None)
    image_link: str | None = Field(default=None)
    source_link: str | None = Field(default=None)
    meta_description: str | None = Field(default=None)
    meta_keywords: str | None = Field(default=None)


# Properties to receive on news creation
class NewsCreate(NewsBase):
    id: str = Field(unique=True, primary_key=True, index=True, max_length=255)


# Properties to receive on item update
class NewsUpdate(NewsBase):
    source_name: str | None = Field(default=None, max_length=255)
    category: str | None = Field(default=None, max_length=255)
    headline: str | None = Field(default=None, max_length=255)
    story: str | None = Field(default=None)
    published_at: datetime | None = Field(default=None)
    image_link: str | None = Field(default=None)
    source_link: str | None = Field(default=None)
    meta_description: str | None = Field(default=None)
    meta_keywords: str | None = Field(default=None)



# Database model, database table inferred from class name
class News(NewsBase, table=True):
    id: str = Field(unique=True, primary_key=True, index=True, max_length=255)


# Properties to return via API, id is always required
class NewsPublic(NewsBase):
    id: str


class NewsList(SQLModel):
    data: list[NewsPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str