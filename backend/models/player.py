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
    # TODO: add height and weight
    # TODO: add injuries
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
        self.rank = rank
        self.adp = adp
        self.stats = stats
        self.auction_valued_at = auction_valued_at
        self.auction_yahoo_avg = auction_yahoo_avg
        self.auction_espn_avg = auction_espn_avg
        self.auction_blend_avg = auction_blend_avg
