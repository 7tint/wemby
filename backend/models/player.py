from ast import In
from typing import Dict


class PlayerStats:
    gp: int
    mpg: float
    fgm: float
    fga: float
    fg_impact: float
    ftm: float
    fta: float
    ft_impact: float
    tpm: float
    pts: float
    reb: float
    ast: float
    stl: float
    blk: float
    to: float

    def __init__(self, gp, mpg, fgm, fga, ftm, fta, tpm, pts, reb, ast, stl, blk, to):
        self.gp = gp
        self.mpg = mpg
        self.fgm = fgm
        self.fga = fga
        self.fg_impact = 0
        self.ftm = ftm
        self.fta = fta
        self.ft_impact = 0
        self.tpm = tpm
        self.pts = pts
        self.reb = reb
        self.ast = ast
        self.stl = stl
        self.blk = blk
        self.to = to


class PlayerInjury:
    id: int
    long_comment: str | None
    short_comment: str | None
    status: str
    date: str
    details: Dict[str, Dict[str, str] | str] | None

    def __init__(self, id, long_comment, short_comment, status, date, details):
        self.id = id
        self.long_comment = long_comment
        self.short_comment = short_comment
        self.status = status
        self.date = date
        self.details = details


class PlayerDraft:
    year: int
    round: int
    selection: int

    def __init__(self, year, round, selection):
        self.year = year
        self.round = round
        self.selection = selection


class Player:
    id: int  # ESPN Player ID
    first_name: str
    last_name: str
    team_id: int
    team: str
    age: int | None
    headshot: str
    years_pro: int
    jersey: int | None
    height: int | None
    weight: int | None
    injuries: list[PlayerInjury]
    draft: PlayerDraft | None
    # TODO: add salary
    rank: int  # Rank in projections
    adp: float | None  # Average Draft Position
    positions: list[str]  # List of position eligibilities
    stats: PlayerStats
    auction_valued_at: float | None
    auction_yahoo_avg: float | None
    auction_espn_avg: float | None
    auction_blend_avg: float | None

    def __init__(
        self,
        id,
        first_name,
        last_name,
        positions,
        team_id,
        team,
        headshot,
        years_pro,
        rank,
        stats,
        height,
        weight,
        injuries,
        draft,
        adp=None,
        age=None,
        jersey=None,
        auction_valued_at=None,
        auction_yahoo_avg=None,
        auction_espn_avg=None,
        auction_blend_avg=None,
    ):
        self.id = id
        self.first_name = first_name
        self.last_name = last_name
        self.positions = positions
        self.team_id = team_id
        self.team = team
        self.age = age
        self.headshot = headshot
        self.years_pro = years_pro
        self.jersey = jersey
        self.height = height
        self.weight = weight
        self.injuries = injuries
        self.draft = draft
        self.rank = rank
        self.adp = adp
        self.stats = stats
        self.auction_valued_at = auction_valued_at
        self.auction_yahoo_avg = auction_yahoo_avg
        self.auction_espn_avg = auction_espn_avg
        self.auction_blend_avg = auction_blend_avg
