"""cascade delete orphan users table

Revision ID: d9638b326eb0
Revises: 318ac140ec66
Create Date: 2026-02-16 15:41:45.140247

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd9638b326eb0'
down_revision: Union[str, Sequence[str], None] = '318ac140ec66'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
