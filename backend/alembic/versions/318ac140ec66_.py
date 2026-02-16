"""empty message

Revision ID: 318ac140ec66
Revises: c22fb05c16c8
Create Date: 2026-02-16 15:38:21.897831

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '318ac140ec66'
down_revision: Union[str, Sequence[str], None] = 'c22fb05c16c8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
